"use strict"

const google = require('google');
const fs = require('fs');
const url = require('url');
const _ = require('lodash');
const exportData = require('./exportData');

const Results = require("../models/results")
const MarketShare = require("../models/marketshare")

const multipliers = {
    _1: .25,
    _2: .15,
    _3: .1,
    _4: .07,
    _5: .05,
    _6: .03,
    _7: .02,
    _8: .02,
    _9: .02,
    _10: .02,
    _11: .02,
    _12: .02,
};


const removeDomainChars = /\bpr\b|\bes\b|\ben\b|\bwww\b|\bin\b|\bcom\b|\bco\b|\buk\b|\bmx\b|\bnet\b|\borg\b|\bedu\b|\bit\b|\bbr\b|\bus\b|\bninja\b|\bme\b|\btv\b|\./ig;
let reportTitle = "";
let storedKeywords;

google.tld = "com.mx";
google.lang = "es";
google.resultsPerPage = 10;
google.nextText = google.lang == "en" ? "Next" : "Siguiente"


// scrape the results from google for each keyword
exports.lookup = (req, res, next) => {
        let time = 0;
        let search = [];

        reportTitle = req.body.title || Date.now();
        storedKeywords = req.storedKeywords;
        if (req.body.results)
            google.resultsPerPage = req.body.results;
        for (let i = 0; i < storedKeywords.length; i++) {
            search.push(this.googleIt(storedKeywords[i], time))
            time += 3000;
        }
        Promise.all(search).then(data => {
            this.clean(data, req.averages);
            next();
        });
    }
    // clean and save the file with all the search results and positions

exports.googleIt = (query, time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Looking up ${query.word}`);
            google(query.word, (err, data) => {
                if (err) console.error(err)
                resolve({
                    keyword: query,
                    data: data.links
                });
            });
        }, time);
    });
}
exports.clean = (results, averages) => {
    let data = results.reduce((accumulator, object) => {
        let position = 0;
        object.data = object.data.reduce((acc, ele) => {
            this.cleanCards(ele);

            if (ele.title != "Bug Page") {
                ele.position = position + 1;
                position += 1;
                if (google.resultsPerPage <= 10) {
                    ele.visibility = multipliers[`_${ele.position}`];
                    ele.clicks = Math.round(object.keyword.average * ele.visibility);
                }
                ele.updated = Date.now();
                ele.keyword = object.keyword;
                acc.push(ele);
            }
            return acc;
        }, [])
        return accumulator.concat(object.data);
    }, []);
    this.save(data);
};

exports.cleanCards = ele => {
    if (ele.title.match(/(images|im[A-zÀ-ú]genes)\s(.*)\s/ig) && !ele.link) ele.title = "Google Images";
    if (ele.title.match(/(news|noticias)\s(.*)\s/ig) && !ele.link) ele.title = "Google News";
    else if (ele.link == null) {
        ele.title = ele.title ? ele.title : "Bug Page";
    } else {
        let newTitle = ele.link ? url.parse(ele.link) : ele.link;
        newTitle = newTitle.host
            .replace(removeDomainChars, " ")
            .trim();
        ele.title = newTitle.replace(/\b\w/g, l => l.toUpperCase());
    }
};

exports.save = (results) => {
    let promises = [];
    for (let object of results) {
        let promise = Results.saveResult(object);
        promises.push(promise);
    }
    Promise.all(promises)
        .then(marketshare => {

            let report = {
                title: reportTitle,
                type: google.resultsPerPage > 10 ? "Positions Report" : "Market Share",
                results: marketshare,
                keywords: storedKeywords
            }

            MarketShare.save(report)

            console.log('------------------------------------');
            console.log("All Results saved");
            console.log('------------------------------------');
        })
        .catch(err => console.log(err));
};