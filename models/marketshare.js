const mongoose = require('mongoose');

const db = require('./config');
const KeywordSchema = require('./keywords');
const ResultSchema = require('./results');


let MarketShareSchema = mongoose.Schema({
    title: { type: String, required: true },
    updated: { type: Date },
    href: String,
    keywords: [{ keyword: "string", by: mongoose.Schema.Types.ObjectId }],
    results: [{ result: "string", by: mongoose.Schema.Types.ObjectId }]
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