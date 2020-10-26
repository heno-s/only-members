const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;

const userStatisticsSchema = new Schema({
    logInTimes: {type: Number, default: 0},
    visitedPages: {type: Number, default: 0},
    adminAttempts: {type: Number, default: 0},
    memberAttempts: {type: Number, default: 0},
    lastLogInTime: Date,
    lastLogOutTime: Date,
    user: {type: mongoose.Types.ObjectId, ref: "user", required: true},
});

userStatisticsSchema.virtual("last_log_in_time_formatted").get(function() {
    return moment(this.lastLogInTime).format("DD.MM.YYYY");
});

userStatisticsSchema.virtual("last_log_out_time_formatted").get(function() {
    return moment(this.lastLogOutTime).format("DD.MM.YYYY");
});

module.exports = mongoose.model("user-statistics", userStatisticsSchema);