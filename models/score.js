var mongoose = require('mongoose');

var db = require('../utils/config');

let ScoreSchema = mongoose.Schema({
    url: { type: String, required: true, unique: true },
    updated: { type: Date, required: true, default: Date.now },
    subdomain: String,
    root_domain: String,
    external_equity_links: Number,
    subdomain_external_links: Number,
    domain_external_links: Number,
    juice_passing_links: Number,
    subdomains_linking: Number,
    domains_linking: Number,
    links: Number,
    subdomain_subs_linking: Number,
    domain_domains_linking: Number,
    mozRank: Number,
    subdomain_mozRank: Number,
    domain_mozRank: Number,
    mozTrust: Number,
    subdomain_mozTrust: Number,
    domain_mozTrust: Number,
    external_mozRank: Number,
    subdomain_external_juice: Number,
    domain_external_juice: Number,
    subdomain_domain_juice: Number,
    domain_domain_juice: Number,
    spam_score: Number,
    facebook: String,
    twitter: String,
    http_status: Number,
    subdomain_links: Number,
    domain_links: Number,
    domains_linking_to_subdomain: Number,
    page_authority: Number,
    domain_authority: Number,
    external_links: Number,
    external_links_to_subdomain: Number,
    external_links_to_root: Number,
    linking_c_blocks: Number
})

exports.Score = mongoose.model('Score', ScoreSchema);

exports.findAll = () => {
    return new Promise((resolve, reject) =>
        this.Score.find((err, words) => {
            if (err) reject(err);
            resolve(words);
        })
    );
};

exports.findById = id => {
    return new Promise((resolve, reject) => {
        this.Score.findById(id, (err, keyword) => {
            if (err) reject(err);
            resolve(keyword)
        });
    });
};

exports.findOne = url => {
    return new Promise((resolve, reject) =>
        this.Score.findOne({ link: url }, (err, response) => {
            if (err) reject(err);
            resolve(response);
        })
    );
};

exports.save = score => {
    score.updated = Date.now();
    score.url = score.url ? score.url : score.subdomain;
    let savable = new this.Score(score)
    return new Promise((resolve, reject) => {
        this.Score.findOne({ url: savable.url }, (err, response) => {
            if (err) reject(err);
            if (response) {
                resolve(response);
            } else
                savable.save((err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
        })
    });
};