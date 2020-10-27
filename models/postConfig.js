const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;

const postConfigSchema = new Schema({
    titleColor: {type: String, default: "#FFFFFF"},
    bodyColor: {type: String, default: "#FFFFFF"},
    shadowColor: String,
});


module.exports = mongoose.model("post-config", postConfigSchema);