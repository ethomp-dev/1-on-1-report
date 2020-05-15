'use strict';

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
var moment = require('moment');

var jsonConfig = readFileSync(join(__dirname, '../config.json'), 'utf8');
var config = JSON.parse(jsonConfig);

var jsonData = readFileSync(join(__dirname, 'data.json'), 'utf8');
var data = JSON.parse(jsonData);

var { dateFormat, sections } = config;
var reportDate = process.argv[2] || moment().format(dateFormat);

var cardActions = data.actions;

// TODO: make this logic configurable to support different comment formats
var recentComments = cardActions.filter((action) =>
    action.data.text && action.data.text.includes(reportDate)
);

var parsedRecentComments = recentComments.map((comment) => {
    const { text, card } = comment.data;
    console.log(text);

    if (!card) return;

    var commentOrder = -1;
    var commentTitle = '';
    // TODO: make this logic configurable to support different comment formats
    var commentDescription = text && (
        text.indexOf('\n\n') >= 0 ?
            text.substring(text.indexOf('\n\n') + 2, text.length)
            : 'Not yet started'
        );

    var sectionMap = {
        PANDEMIC: sections.find((section) => section.id === 'PANDEMIC')
    };

    switch (card.id) {
        case sectionMap.PANDEMIC.cardId:
            // the "PANDEMIC" card doesn't have any prefix in the title, so use it as is
            commentTitle = card.name;
            break;
        default:
            commentOrder = sections.find((section) => section.cardId === card.id).order;
            // all other cards have a number prefix in the title (ex. "1. Title"), so remove it here
            commentTitle = card.name && card.name.substring(3, card.name.length);
    }

    return {
        order: commentOrder,
        text: `${commentTitle}\n${commentDescription}`,
    };
});

var parsedRecentComments = parsedRecentComments.sort((a, b) => {
    var orderA = a.order;
    var orderB = b.order;
    return orderA - orderB;
})

var reportTitle = `1:1 Report for ${reportDate}`;
var reportBody = '';

parsedRecentComments.forEach((comment) => {
    reportBody += `${comment.text}\n\n`;
});

writeFileSync(join(__dirname, `../reports/${reportDate}.txt`), `${reportTitle}\n\n${reportBody}`);
