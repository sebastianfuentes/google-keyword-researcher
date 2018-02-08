const og = require('../utils/open-graph');

const Report = require('../models/report');

exports.fetchUrl = (req, res, next) => {
    og("https://github.com/", (err, response) => {
        req.og = response;
        console.log('------------------------------------');
        console.log(response);
        console.log('------------------------------------');
        next()
    })
};