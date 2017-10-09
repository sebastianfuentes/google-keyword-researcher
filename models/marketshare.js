const mongoose = require('mongoose');

const db = require('./config');


let MarketShareSchema = mongoose.Schema({
    title: { type: String, required: true },
    updated: { type: Date, default: Date.now },
    href: String,
    keywords: [{ keyword: Schema.Types.ObjectId, ref: "Keyword" }],
    results: [{ result: Schema.Types.ObjectId, ref: "Results" }]
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