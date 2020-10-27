const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;

const postConfigSchema = new Schema({
    turnedOn: {type: Boolean, default: true},
    titleColor: {type: String, default: "#FFFFFF"},
    bodyColor: {type: String, default: "#FFFFFF"},
    dropShadow: {type: Boolean, default: false},
});


module.exports = mongoose.model("post-config", postConfigSchema);