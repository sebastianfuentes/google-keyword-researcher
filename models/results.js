const mongoose = require('mongoose');
var db = require('../utils/config');

const KeywordSchema = require('./keywords');

let ResultSchema = mongoose.Schema({
    title: { type: String, required: true },
    updated: { type: Date, default: Date.now(), required: true },
    link: String,
    description: String,
    clicks: Number,
    visibility: Number,
    href: String,
    position: Number,
    keyword: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Keyword"
    }
});

ResultSchema.index({ keyword: 1, title: 1, link: 1 });


exports.Result = mongoose.model('Result', ResultSchema);

exports.findResults = () => {
    return new Promise((resolve, reject) =>
        this.Result.find((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    );
}

exports.findResultByTitle = (title) => {
    return new Promise((resolve, reject) =>
        this.Result.find({ title: title }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    );
}

exports.findByMultipleKeywords = (keywords) => {
    return new Promise((resolve, reject) =>
        this.Result.find({ keyword: { $in: keywords } }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    );
}

exports.findByKeyword = (keyword) => {
    return new Promise((resolve, reject) =>
        this.Result.find({ keyword: keyword }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        }).populate("keyword")
    );
}

exports.saveResult = (object) => {
    return new Promise((resolve, reject) => {
        this.Result.findOneAndUpdate({ link: object.link }, object, { upsert: true }, (err, data) => {
            object.updated = Date.now();
            if (err) reject(err);
            resolve(data);
        })
    });
}