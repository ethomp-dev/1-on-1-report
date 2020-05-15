# 1:1 Report

## Getting Started

Clone the repository and install dependencies:

    git clone git@github.com:elizabethompson/1-on-1-report.git
    cd 1-on-1-report
    npm install

Create a copy of the config file and update with your settings:

    cp config.json.example config.json

Export JSON data from Trello and save as `dist/data.json`.

Build and run the script:

    npm start

## Creating a Report

By default the report script uses today's date, but optionally accepts a date argument.

    npm run report [<date>]

The report will be generated within the `reports/` directory, with a filename that matches the date of the report.