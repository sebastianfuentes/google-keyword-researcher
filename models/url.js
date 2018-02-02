const mongoose = require('mongoose');

const db = require('../utils/config');
const Score = require('../models/score');

let UrlSchema = mongoose.Schema({
    url: { type: String, required: true, unique: true },
    score: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Score"
    },
    updated: { type: Date, required: true, default: Date.now }
})

exports.Url = mongoose.model('Url', UrlSchema);

exports.findAll = () => {
    return new Promise((resolve, reject) =>
        this.Url.find((err, words) => {
            if (err) reject(err);
            resolve(words);
        })
    );
};

exports.findById = id => {
    return new Promise((resolve, reject) => {
        this.Url.findById(id, (err, keyword) => {
            if (err) reject(err);
            resolve(keyword)
        });
    });
};

exports.findOne = url => {
    return new Promise((resolve, reject) =>
        this.Url.findOne({ link: url }, (err, response) => {
            if (err) reject(err);
            resolve(response);
        })
    );
};

exports.save = object => {
    let savable = new this.Url({ url: (typeof object.link == "object" && object.link) ? object.link.url : object.href, updated: Date.now() })
    if (savable.url == null)
        savable.url = object.title
    return new Promise((resolve, reject) => {
        this.Url.findOne({ url: savable.url }, (err, response) => {
            if (err) reject(err);
            if (response) {
                resolve(response);
            } else if (!response && typeof savable.url == "string")
                savable.save((err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
        })
    });
};

exports.saveScore = score => {
    return new Promise((resolve, reject) => {
        this.Url.findOne({ url: score.url }, (err, data) => {
            if (err) {
                reject(err)
            }
            let url = new this.Url(data);
            url.score = score;
            url.save((err, saved) => {
                if (err) reject(err);
                resolve(data)
            });
        });
    });
};