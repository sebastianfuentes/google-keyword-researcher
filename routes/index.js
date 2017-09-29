const express = require('express');
const router = express.Router();
const models = require("../models/keywords")

const keywords = require("../controllers/keywords");
const search = require("../controllers/search");

/* GET home page. */
router.get('/', keywords.getJson, function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/',
    keywords.getJson,
    keywords.clean,
    keywords.save,
    search.lookup,
    function(req, res, next) {
        res.render('index', { title: 'Express' });
    }
);

module.exports = router;