var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/tool', {
    useMongoClient: true
});

module.exports = mongoose.connection;