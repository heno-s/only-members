const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;

const memberConfigSchema = new Schema({
    on: {type: Boolean, default: true},
    titleColor: {type: String, default: "#FFFFFF"},
    contentColor: {type: String, default: "#FFFFFF"},
    dropShadow: {type: Boolean, default: false},
});


module.exports = mongoose.model("member-config", postSchema);