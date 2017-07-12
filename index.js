'use strict'

const keywords = require('./keywords.js');

let cleanedKeywords = keywords.init(process.argv[2] ? (process.argv[2].indexOf(".csv") !== -1 ? `./csv/${process.argv[2]}` : `./csv/${process.argv[2]}.csv`) : undefined, true);