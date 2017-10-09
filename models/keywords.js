var mongoose = require('mongoose');

var db = require('./config');

let KeywordSchema = mongoose.Schema({
    word: { type: String, required: true, unique: true },
    updated: { type: Date, default: Date.now },
    average: Number
})

let Keyword = mongoose.model('Keyword', KeywordSchema);

exports.findAll = () => {
    return new Promise((resolve, reject) =>
        Keyword.find((err, words) => {
            if (err) console.log(err);
            resolve(words);
        })
    );
}

exports.findOne = (keyword) => {
    return new Promise((resolve, reject) =>
        Keyword.find({ word: keyword }, (err, word) => {
            if (err) console.log(err);
            resolve(word);
        })
    );
}

exports.saveKeyword = (object) => {
    return new Promise((resolve, reject) =>
        Keyword.findOneAndUpdate({ word: object.keyword }, object, { upsert: true }, (err, word) => {
            if (err) console.log(err);
            resolve(word);
        })
    );
}