var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Term = new Schema({
    keyword: String,
    when: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Term', Term);