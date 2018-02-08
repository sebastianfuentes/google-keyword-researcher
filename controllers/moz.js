"use strict"

const path = require("path");
const Mozscape = require('../utils/moz.scape').Mozscape;
const dictionary = require('../utils/moz.dictionary');
const dummy = require('../utils/moz.interpreted');

const Report = require('../models/report');
const Url = require('../models/url');
const Score = require('../models/score');

let moz = new Mozscape(process.env.MOZ_ID, process.env.MOZ_KEY)

exports.batchUrls = async(req, res, next) => {
    let links = [];
    let chunks = [];

    for (let result of req.moz.results) {
        let link = await Url.findById(result.link);
        links.push(link.url)
    }

    links = links.filter(link => {
        if (link.includes("http"))
            return link;
    });

    while (links.length > 0) {
        let chunk = links.splice(0, 10)
        chunks.push(chunk)
    }
    req.chunks = chunks;
    next();
}

exports.fetchUrls = async chunk => {
    let mozData = new Promise((resolve, reject) => moz.bulkUrlMetrics(chunk, [
        'title',
        'url',
        'subdomain',
        'root_domain',
        'external_equity_links',
        'subdomain_external_links',
        'domain_external_links',
        'juice_passing_links',
        'subdomains_linking',
        'domains_linking',
        'links',
        'subdomain_subs_linking',
        'domain_domains_linking',
        'mozRank',
        'subdomain_mozRank',
        'domain_mozRank',
        'mozTrust',
        'subdomain_mozTrust',
        'domain_mozTrust',
        'external_mozRank',
        'subdomain_external_juice',
        'domain_external_juice',
        'subdomain_domain_juice',
        'domain_domain_juice',
        'spam_score',
        'social',
        'http_status',
        'subdomain_links',
        'domain_links',
        'domains_linking_to_subdomain',
        'page_authority',
        'domain_authority',
        'external_links',
        'external_links_to_subdomain',
        'external_links_to_root',
        'linking_c_blocks',
        // 'time_last_crawled',
    ], (err, response) => {
        if (err) {
            console.log(err);
        }
        resolve(this.interpreter(JSON.parse(response.body)))
    }))
    return await mozData;
};

exports.findReport = async(req, res, next) => {
    req.moz = await Report.findById(req.body.report)
    next();
}

exports.getResults = async(req, res, next) => {
    let time = 0;
    let promises = [];

    // for (let chunk of req.chunks) {
    //     let promise;
    //     promise = new Promise(resolve => setTimeout(() => { resolve(this.fetchUrls(chunk)) }, time))
    //     this.fetchUrls(chunk)
    //     promises.push(promise)
    //     time += 11000;
    // }

    // Promise.all(promises).then(results => {
    //     req.moz = results;
    //     next()
    // });

    req.moz = dummy;
    next();
};


exports.interpreter = results => {
    return results.map((page) => {
        let result = {}
        for (let key in dictionary)
            result[dictionary[key]] = page[key];
        return result;
    })
};


exports.save = async(req, res, next) => {
    let promises = [];
    req.moz = [].concat.apply([], req.moz);

    for (let score of req.moz) {
        let saved = await Score.save(score);
        let promise = await Url.saveScore(saved);
        promises.push(promise);
    }

    Promise.all(promises)
        .then(saved => {
            req.moz = saved;
            next();
        })
        .catch(err => console.log(err));
};

exports.test = (req, res, next) => {
    moz.links("https://www.bbc.co.uk/", ["page_to_page"], {
        targetCols: [
            'title',
            'url',
            'subdomain',
            'root_domain',
            'external_equity_links',
            'subdomain_external_links',
            'domain_external_links',
            'juice_passing_links',
            'subdomains_linking',
            'domains_linking',
            'links',
            'subdomain_subs_linking',
            'domain_domains_linking',
            'mozRank',
            'subdomain_mozRank',
            'domain_mozRank',
            'mozTrust',
            'subdomain_mozTrust',
            'domain_mozTrust',
            'external_mozRank',
            'subdomain_external_juice',
            'domain_external_juice',
            'subdomain_domain_juice',
            'domain_domain_juice',
            'spam_score',
            'social',
            'http_status',
            'subdomain_links',
            'domain_links',
            'domains_linking_to_subdomain',
            'page_authority',
            'domain_authority',
            'external_links',
            'external_links_to_subdomain',
            'external_links_to_root',
            'linking_c_blocks',
        ],
        sourceCols: [
            'title',
            'url',
            'subdomain',
            'root_domain',
            'external_equity_links',
            'subdomain_external_links',
            'domain_external_links',
            'juice_passing_links',
            'subdomains_linking',
            'domains_linking',
            'links',
            'subdomain_subs_linking',
            'domain_domains_linking',
            'mozRank',
            'subdomain_mozRank',
            'domain_mozRank',
            'mozTrust',
            'subdomain_mozTrust',
            'domain_mozTrust',
            'external_mozRank',
            'subdomain_external_juice',
            'domain_external_juice',
            'subdomain_domain_juice',
            'domain_domain_juice',
            'spam_score',
            'social',
            'http_status',
            'subdomain_links',
            'domain_links',
            'domains_linking_to_subdomain',
            'page_authority',
            'domain_authority',
            'external_links',
            'external_links_to_subdomain',
            'external_links_to_root',
            'linking_c_blocks',
        ],
        linkCols: ["flags", "anchor_text", "mozRank_passed", ]
    }, (err, response) => {
        if (err) console.log(err);
        req.moz = response;

        next()
    });
};