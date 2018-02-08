var mongoose = require('mongoose');

var db = require('../utils/config');

let KeywordSchema = mongoose.Schema({
    word: { type: String, required: true, unique: true },
    updated: { type: Date, required: true, default: Date.now },
    average: Number
})

exports.Keyword = mongoose.model('Keyword', KeywordSchema);

exports.findAll = () => {
    return new Promise((resolve, reject) =>
        this.Keyword.find((err, words) => {
            if (err) reject(err);
            resolve(words);
        })
    );
}

exports.findById = id => {
    return new Promise((resolve, reject) => {
        this.Keyword.findById(id, (err, keyword) => {
            if (err) reject(err);
            resolve(keyword)
        });
    });
};

exports.findOne = keyword => {
    return new Promise((resolve, reject) =>
        this.Keyword.findOne({ word: keyword }, (err, word) => {
            if (err) reject(err);
            resolve(word);
        })
    );
}

exports.save = object => {
    let savable = new this.Keyword(object)
    object.updated = Date.now();
    return new Promise((resolve, reject) => {
        this.Keyword.findOne({ word: savable.key }, (err, response) => {
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
}

exports.save = object => {
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