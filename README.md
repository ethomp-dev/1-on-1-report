# 1:1 Report

## Getting Started

Clone the repository and install dependencies:

    git clone git@github.com:elizabethompson/1-on-1-report.git
    cd 1-on-1-report
    npm install

Create a copy of the config file:

    cp config.json.example config.json

Update `config.json` with your Trello secrets and preferences:

| Key          | Type   | Default                      | Description  |
| ------------ |:------:| ---------------------------- | ------------ |
| `boardId`    | string | `""` | The 8-digit key in your Trello board link |
| `auth`       | object | `{`<br>&nbsp;&nbsp;&nbsp;&nbsp;`"key": "",`<br>&nbsp;&nbsp;&nbsp;&nbsp;`"token": ""`<br>`}` | The developer API key and token for your Trello account which can be generated here: https://trello.com/app-key |
| `dateFormat` | string | `"MM.DD.YYYY"` | The date format used in your Trello board comments |
| `sections`   | array  | `[`<br>&nbsp;&nbsp;&nbsp;&nbsp;`{`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"id":`&nbsp;`"PANDEMIC",`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"order":`&nbsp;`0,`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"cardId":`&nbsp;`"",`<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`"hasNumericalPrefix":`&nbsp;`true`<br>&nbsp;&nbsp;&nbsp;&nbsp;`},`<br>&nbsp;&nbsp;&nbsp;&nbsp;`...`<br>`]` | The `cardId` for each section corresponds to Trello cards in the "1:1 Questions" list |


Build and run the script:

    npm start

## Creating a Report

By default the report script uses today's date, but optionally accepts a date argument.

    npm run report [<date>]

The report will be generated within the `reports/` directory, with a filename that matches the date of the report.