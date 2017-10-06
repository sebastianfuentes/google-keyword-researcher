"use strict"

const google = require('google');
const fs = require('fs');
const url = require('url');
const _ = require('lodash');
const exportData = require('./exportData');

const Results = require("../models/results")


let formatedResults = [];
let rankedResults = [];
let removeDomainChars = /\bpr\b|\bes\b|\ben\b|\bwww\b|\bin\b|\bcom\b|\bco\b|\buk\b|\bmx\b|\bnet\b|\borg\b|\bedu\b|\bit\b|\bbr\b|\bus\b|\bninja\b|\bme\b|\btv\b|\./ig;

google.tld = "com.mx";
google.lang = "es";
google.resultsPerPage = 10;
google.nextText = google.lang == "en" ? "Next" : "Siguiente"


// scrape the results from google for each keyword
exports.lookup = (req, res, next) => {
        let time = 0;
        let search = [];
        for (let query of req.json) {
            search.push(this.googleIt(query.keyword, time))
            time += 3000;
        }
        Promise.all(search).then(data => {
            this.clean(data);
            next();
        });
    }
    // clean and save the file with all the search results and positions

exports.googleIt = (query, time) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`Looking up ${query}`);
            google(query, (err, data) => {
                if (err) console.error(err)
                resolve({
                    keyword: query,
                    data: data.links
                });
            });
        }, time);
    });
}
exports.clean = (results) => {
    let data = results.reduce((accumulator, object) => {
        let position = 0;
        object.data = object.data.reduce((acc, ele) => {
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
            if (ele.title != "Bug Page") {
                ele.position = position + 1;
                position += 1;
                ele.keyword = object.keyword;
                acc.push(ele);
            }
            return acc;
        }, [])
        return accumulator.concat(object.data);
    }, []);
    this.save(data);
}

exports.save = (results) => {
    let promises = [];
    for (let object of results) {
        console.log(`Saving position ${object.position} from ${object.keyword} to the database`);
        let promise = Results.saveResult(object);
        promises.push(promise);
    }
    Promise.all(promises).then(() => {
        console.log('------------------------------------');
        console.log("All Results saved");
        console.log('------------------------------------');
        next();
    });
};