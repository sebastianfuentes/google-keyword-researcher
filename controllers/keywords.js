"use strict"

const csvtojson = require('csvtojson');
const fs = require('fs');
const path = require("path");

const Keywords = require("../models/keywords");

exports.getJson = (req, res, next) => {
    console.log('Parsing CSV file to JSON');
    csvtojson({
            flatKeys: true,
            headers: ['keyword', 'average']
        })
        .fromFile(path.join(__dirname, "..", req.body.file))
        .on('done', (error) => {
            if (error)
                console.log('error: ', error);
        })
        .on('end_parsed', (obj) => {
            req.storedKeywords = obj;
            next();
        })

};

// we only want to keep valid Keywords and above 200 queries a month and 
exports.clean = (req, res, next) => {
    req.storedKeywords = req.storedKeywords.reduce((acc, ele) => {
        ele.average = Number(ele.average);
        if (ele.average > 200 && ele.keyword.length > 0 && !ele.keyword.match(/\uFFFD/g))
            acc.push(ele)
        return acc;
    }, []);
    next()
};

// create an array of promises so we can handle separately in case 
// we encounter errors in the database so it won't affect the saving process
exports.save = (req, res, next) => {
    let promises = [];
    req.averages = {};
    for (let object of req.storedKeywords) {
        console.log(`Saving \"${object.keyword}\" to the database`);
        req.averages[object.keyword] = object.average;
        let promise = Keywords.save(object);
        promises.push(promise);
    }
    Promise.all(promises).then(keywords => {
        req.storedKeywords = keywords;
        console.log('------------------------------------');
        console.log("All Keywords saved");
        console.log('------------------------------------');
        next();
    });
};