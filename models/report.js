const mongoose = require('mongoose');

var db = require('../utils/config');
const KeywordSchema = require('./keywords');
const ResultSchema = require('./results');


let ReportSchema = mongoose.Schema({
    title: { type: String },
    updated: { type: Date, default: Date.now() },
    type: { type: String, required: true, default: "Market Share", enum: ["Market Share", "Position Report"] },
    keywords: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Keyword"
    }],
    results: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Result"
    }]
});

exports.Report = mongoose.model('Report', ReportSchema);

exports.findResults = () => {
    return new Promise((resolve, reject) =>
        this.Report.find((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    );
}

exports.save = (object) => {
    return new Promise((resolve, reject) => {
        object.updated = Date.now();
        this.Report.findOneAndUpdate({ title: object.title }, object, { upsert: true }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    });
}