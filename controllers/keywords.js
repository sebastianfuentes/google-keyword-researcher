"use strict"

const csv2json = require('csv2json');
const fs = require('fs');
const search = require('./search');

exports.csvToJson = (req, res, next) => {
    // default parameters in case csv is already parsed
    // read the csv and parse it to json
    fs.createReadStream(file)
        .pipe(csv2json({
            // Defaults to comma. 
            separator: ','
        }))
        .pipe(fs.createWriteStream('json/keywords.json'))
        .on('finish', () => {
            // if finished parsing read the json into a variable
            next()
        });
};

exports.cleanKeywords = (keywords) => {
    let cleanKeywords = new Promise((resolve, reject) => {
        let cleanedKeywords = [];
        for (let keyword of keywords) {
            // remove unuseful parameters
            let newKeyword = {
                keyword: keyword.Keyword,
                average: keyword['Avg. Monthly Searches (exact match only)']
            };
            // clean empty keywords or with less than 200 hundred monthly average searches
            if (newKeyword.average > 200 && newKeyword.keyword.length > 0 && !newKeyword.keyword.match(/\uFFFD/g))
                cleanedKeywords.push(newKeyword);
        }
        resolve(cleanedKeywords);
    });
    cleanKeywords.then((res) => {
            fs.writeFile("./json/keywords.json", JSON.stringify(res, null, 2), (err) => {
                if (err) return console.log(err);
            });
            search.searchInGoogle(res);
        })
        .catch((err) => {
            console.log(err);
        });
};