var mongoose = require('config');

let ResultSchema = mongoose.Schema({
    keyword: { type: String, required: true },
    title: { type: String, required: true },
    link: String,
    Description: String,
    href: String,
    position: Number
})

let Result = mongoose.model('Result', ResultSchema);