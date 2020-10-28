const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;

const colorsObj = {
    text: {type: String, default: "#ffffff"},
    shadow: String,
}

const postConfigSchema = new Schema({
    titleColors: colorsObj,
    bodyColors: colorsObj,
});


module.exports = mongoose.model("post-config", postConfigSchema);