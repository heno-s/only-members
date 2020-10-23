const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;

const userStatisticsSchema = new Schema({
    logInTimes: {type: Number, default: 0},
    visitedPages: {type: Number, default: 0},
    adminAttempts: {type: Number, default: 0},
    memberAttempts: {type: Number, default: 0},
    user: {type: mongoose.Types.ObjectId, ref: "user", required: true},
});


module.exports = mongoose.model("user-statistics", userStatisticsSchema);