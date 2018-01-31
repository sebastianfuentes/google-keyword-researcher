var mongoose = require('mongoose');

var db = require('../utils/config');

let DomainSchema = mongoose.Schema({
    url: { type: String, required: true, unique: true },
    // score: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Score"
    // },
    links: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url"
    }],
    updated: { type: Date, required: true, default: Date.now }
})

exports.Domain = mongoose.model('Domain', DomainSchema);

exports.findAll = () => {
    return new Promise((resolve, reject) =>
        this.Domain.find((err, words) => {
            if (err) reject(err);
            resolve(words);
        })
    );
};

exports.findById = id => {
    return new Promise((resolve, reject) => {
        this.Domain.findById(id, (err, keyword) => {
            if (err) reject(err);
            resolve(keyword)
        });
    });
};

exports.findOne = url => {
    return new Promise((resolve, reject) =>
        this.Domain.findOne({ url: url }, (err, response) => {
            if (err) reject(err);
            resolve(response);
        }));
};

exports.save = (object, link) => {
    object.updated = Date.now();
    let domain = new this.Domain({ url: object.domain, updated: Date.now(), links: [link] })
    return new Promise((resolve, reject) => {
        this.Domain.findOne({ url: object.domain }, (err, response) => {
            if (err) reject(err);
            if (response) {
                this.Domain.update(response._id, { new: true }, { $addToSet: { items: link } }, function(err, data) {
                    if (data.nModified)
                        resolve(data);
                    else
                        resolve(response);
                });
            } else if (!response && domain.url) {
                domain.save((err, data) => {
                    if (err) reject(err);
                    resolve(data);
                });
            }
        })
    });
};