const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;

const configObj = {
    textColor: {type: String, default: "#ffffff"},
    hasShadow: {type: Boolean, default: false},
    shadowColor: String,
    shadowSize: {type: String, default: ".15em .08em"}
}

const postConfigSchema = new Schema({
    title: configObj,
    body: configObj,
});


module.exports = mongoose.model("post-config", postConfigSchema);