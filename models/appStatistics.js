const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;

const appStatisticsSchema = new Schema({
    visitedPages: {type: Number, default: 0},
    pageSubmissions: {type: Number, default: 0},
});


module.exports = mongoose.model("app-statistics", appStatisticsSchema);