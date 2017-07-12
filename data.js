"use strict"

const google = require('google');
const fs = require('fs');
const url = require('url');
const exportData = require('./exportData');
const search = require('./search');


let formatedResults = [];
let rankedResults = [];

// scrape the results from google for each keyword
(() => {
    exportData.cleanResults("./json/results.json")
})();