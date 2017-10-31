const fs = require('fs');
const json2csv = require('json2csv');
const _ = require("lodash");

const Keywords = require("../models/keywords");
const Results = require("../models/results");
const MarketShare = require("../models/marketshare");

exports.init = (req, res, next) => {
    req.json.map(ele => {
        Results.findByMultipleKeywords(ele.keyword).then(response => { this.marketShare(response, req.json) });
    });
    next()
        // this.cleanToCsv(cleaned);
};

exports.marketShare = (json, keywords) => {

    var results = _.flattenDeep(json);

    var uniqCompanies = _.uniqBy(results, function(e) {
        return e.title;
    });

    var totalVisits = Math.round((keywords.reduce((a, b) => a + parseInt(b.average), 0) * .73) * 100) / 100
        // var totalVisits = .reduce((a, b)=> a + b.average , 0);

    var MarketShare = uniqCompanies.map((e) => {
        var object = {
            company: e.title,
            visits: 0,
            percentage: 0,
            website: e.link
        }
        for (var i = 0; i < results.length; i++) {
            if (e.title == results[i].title && results[i].clicks) {
                object.visits += results[i].clicks;
            }
        }
        object.percentage = `${Math.round((object.visits/totalVisits * 100) * 100) / 100}%`;
        return object;
    });
    this.save(MarketShare);
    // this.exportMarketShare(MarketShare);
};

exports.save = data => {
    let promises = [];
    for (let marketshare of data) {
        promises.push(MarketShare.save(marketshare));
    }
    Promise.all(promises).then((response) => {
        console.log('------------------------------------');
        console.log("All  saved");
        console.log('------------------------------------');
    });
};

exports.cleanToCsv = (json) => {
    const fields = [
        'Keyword',
        'Searches',
        "MarketShare._1.title", "MarketShare._1.visibility",
        "MarketShare._2.title", "MarketShare._2.visibility",
        "MarketShare._3.title", "MarketShare._3.visibility",
        "MarketShare._4.title", "MarketShare._4.visibility",
        "MarketShare._5.title", "MarketShare._5.visibility",
        "MarketShare._6.title", "MarketShare._6.visibility",
        "MarketShare._7.title", "MarketShare._7.visibility",
        "MarketShare._8.title", "MarketShare._8.visibility",
        "MarketShare._9.title", "MarketShare._9.visibility",
        "MarketShare._10.title", "MarketShare._10.visibility"
    ];
    const fieldNames = ['Keyword', 'Average Monthly Searches', "Rank 1", "0.25", "Rank 2", "0.15", "Rank 3", "0.1", "Rank 4", "0.07", "Rank 5", "0.05", "Rank 6", "0.03", "Rank 7", "0.02", "Rank 8", "0.02", "Rank 9", "0.02", "Rank 10", "0.02"];
    var data = json.map((e) => {
        var result = {
            Keyword: e.Keyword,
            MarketShare: {
                _1: null,
                _2: null,
                _3: null,
                _4: null,
                _5: null,
                _6: null,
                _7: null,
                _8: null,
                _9: null,
                _10: null
            },
            Searches: e.Searches
        }
        for (var i = 0; i < e.MarketShare.length; i++) {
            result.MarketShare[`_${i+1}`] = {
                title: e.MarketShare[i].title,
                visibility: e.MarketShare[i].visibility
            }
        }
        return result;
    });
    var csv = json2csv({ data: data, fields: fields, fieldNames: fieldNames });
    fs.writeFile('./csv/Ranking-por-keyword.csv', csv, function(err) {
        if (err) throw err;
        console.log('Data exported to csv');
    });
    this.marketShare(json);
}


exports.exportMarketShare = (MarketShare) => {
    const fields = [
        'company',
        'visits',
        'percentage',
        'website',
    ];
    const fieldNames = ['Company Name', "Visits", "Percentage", "Website"];
    var csv = json2csv({ data: MarketShare, fields: fields, fieldNames: fieldNames });
    fs.writeFile('./csv/Market-Share.csv', csv, function(err) {
        if (err) throw err;
        console.log('Data exported to csv');
    });
};