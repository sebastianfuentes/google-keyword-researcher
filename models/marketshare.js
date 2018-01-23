const mongoose = require('mongoose');

const db = require('./config');
const KeywordSchema = require('./keywords');
const ResultSchema = require('./results');

let MarkerShareSchema = mongoose.Schema({
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