var mongoose = require('mongoose');

var db = require('./config');

let KeywordSchema = mongoose.Schema({
    word: { type: String, required: true, unique: true },
    average: Number
})

let Keyword = mongoose.model('Keyword', KeywordSchema);

exports.findKeywords = () => {
    return new Promise((resolve, reject) =>
        Keyword.find((err, word) => {
            if (err) console.log(err);
            resolve(word);
        })
    );
}

exports.findKeyword = (keyword) => {
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