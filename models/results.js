const mongoose = require('mongoose');
const db = require('./config');


let ResultSchema = mongoose.Schema({
    title: { type: String, required: true },
    link: String,
    description: String,
    clicks: Number,
    visibility: Number,
    href: String,
    position: Number,
    keyword: { type: String, required: true }
});

ResultSchema.index({ keyword: 1, title: 1, link: 1 });


let Result = mongoose.model('Result', ResultSchema);

exports.findResults = () => {
    return new Promise((resolve, reject) =>
        Result.find((err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    );
}

exports.findResultByTitle = (title) => {
    return new Promise((resolve, reject) =>
        Result.find({ title: title }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    );
}

exports.findResultByKeyword = (keyword) => {
    return new Promise((resolve, reject) =>
        Result.find({ keyword: keyword }, (err, data) => {
            if (err) reject(err);
            resolve(data);
        })
    );
}

exports.saveResult = (object) => {
    return new Promise((resolve, reject) =>
        Result.findOneAndUpdate({ keyword: object.keyword, link: object.link }, object, { upsert: true }, (err, data) => {
            if (err) console.log(err);
            resolve(data);
        })
    );
}