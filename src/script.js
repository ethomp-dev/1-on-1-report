'use strict'

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
const fetch = require('node-fetch')
const qs = require('query-string')
const moment = require('moment')

const reportGenerator = {
  init: async function () {
    const config = this.fetchConfig()
    const { boardId, auth, dateFormat, sections } = config

    try {
      this.validateConfig(config)

      const reportDate = process.argv[2] || moment().format(dateFormat)
      const data = await this.fetchData(boardId, auth)

      let recentComments = this.getRecentComments(data, reportDate)
      recentComments = this.parseComments(recentComments, sections)
      recentComments = this.sortComments(recentComments)

      const report = this.formatReport(reportDate, recentComments)
      writeFileSync(join(__dirname, `../reports/${reportDate}.txt`), report)

      console.log(`Successfully generated report for ${reportDate}`)
    } catch (error) {
      console.error(error.message)
    }
  },
  validateConfig: ({ boardId, auth }) => {
    if (!boardId) throw new Error('Missing Configuration: Trello Board ID')
    if (!auth.key) throw new Error('Missing Configuration: Trello API Key')
    if (!auth.token) throw new Error('Missing Configuration: Trello API Token')
  },
  fetchConfig: () => {
    const json = readFileSync(join(__dirname, '../config.json'), 'utf8')
    return JSON.parse(json)
  },
  fetchData: async (boardId, auth = {}) => {
    const options = { encode: false }
    const params = {
      key: auth.key,
      token: auth.token,
      fields: '&actions=commentCard'
    }

    return fetch(`https://trello.com/b/${boardId}.json?${qs.stringify(params, options)}`).then(res => res.json())
  },
  getRecentComments: (data, reportDate) => {
    if (!data.actions) throw new Error('API Error: Could not retrieve data')

    // TODO: make this logic configurable to support different comment formats
    return data.actions.filter((action) => action.data.text && action.data.text.includes(reportDate))
  },
  parseComments: (comments, sections) => {
    return comments.map((comment) => {
      const { text, card } = comment.data

      if (!card) return

      let commentOrder = -1
      let commentTitle = ''
      // TODO: make this logic configurable to support different comment formats
      const commentDescription = text && (
        text.indexOf('\n\n') >= 0 ?
          text.substring(text.indexOf('\n\n') + 2, text.length)
          : 'Not yet started'
        )

      const matchingCard = sectionMap.find((section) => section.cardId === card.id)

      // if necessary, remove numerical prefix from title
      commentTitle = !matchingCard.hasNumericalPrefix ? card.name : card.name && card.name.substring(3, card.name.length)
      commentOrder = sections.find((section) => section.cardId === card.id).order

      return {
        order: commentOrder,
        text: `${commentTitle}\n${commentDescription}`,
      }
    })
  },
  sortComments: (comments) => {
    return comments.sort((a, b) => {
      const orderA = a.order
      const orderB = b.order
      return orderA - orderB
    })
  },
  formatReport: (reportDate, comments) => {
    const reportTitle = `1:1 Report for ${reportDate}`
    let reportBody = ''

    comments.forEach((comment) => {
      reportBody += `${comment.text}\n\n`
    })

    return `${reportTitle}\n\n${reportBody}`
  }
}

reportGenerator.init()
