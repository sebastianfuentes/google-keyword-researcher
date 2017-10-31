const mongoose = require('mongoose');

const db = require('./config');
const KeywordSchema = require('./keywords');
const ResultSchema = require('./results');


let MarketShareSchema = mongoose.Schema({
    title: { type: String, required: true },
    updated: { type: Date },
    href: String,
    keywords: [{ keyword: mongoose.Schema.Types.ObjectId, ref: "Keyword" }],
    results: [{ result: mongoose.Schema.Types.ObjectId, ref: "Result" }]
});

let MarketShare = mongoose.model('MarketShare', MarketShareSchema);

exports.findResults = () => {
    return new Promise((resolve, reject) =>
        MarketShare.find((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    );
}

exports.findResults = () => {
    return new Promise((resolve, reject) => {
        MarketShare.find({})
    });
}