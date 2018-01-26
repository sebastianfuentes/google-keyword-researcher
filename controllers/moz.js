"use strict"

const path = require("path");
const Mozscape = require('mozscape').Mozscape;

const dictionary = require('../utils/moz.dictionary')
const dummy = require('../utils/moz.dummy-data')

let moz = new Mozscape(process.env.MOZ_ID, process.env.MOZ_KEY)

exports.fetchUrls = (req, res, next) => {
    moz.bulkUrlMetrics(['turninternational.co.uk', 'verbling.com', 'es.verbling.com', 'www.google.com'], [
        'url',
        'title',
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
        'canonical_url',
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
        'time_last_crawled',
    ], (err, response) => {
        if (err) {
            console.log(err);
            return;
        }
        req.moz = this.interpreter(JSON.parse(response.body));
        next()
    });
};

exports.interpreter = results => {
    return results.map((page) => {
        let result = {}
        for (let key in dictionary)
            result[dictionary[key]] = page[key];
        return result;
    })
};