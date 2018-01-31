const express = require('express');
const router = express.Router();
const models = require("../models/keywords")

const keywords = require("../controllers/keywords");
const search = require("../controllers/search");
const dataHandler = require("../controllers/exportData");
const moz = require("../controllers/moz");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/',
    keywords.getJson,
    keywords.clean,
    keywords.save,
    search.lookup,
    search.save,
    dataHandler.init,
    function(req, res, next) {
        res.send(req.report);
    }
);

router.post('/positions',
    keywords.getJson,
    keywords.clean,
    keywords.save,
    search.lookup,
    search.save,
    // dataHandler.init,
    function(req, res, next) {
        res.send(req.cleanedResults);
    }
);

router.post('/moz',
    moz.findReport,
    moz.batchUrls,
    moz.getResults,
    moz.save,
    function(req, res, next) {
        res.send(req.moz)
    }
)

module.exports = router;