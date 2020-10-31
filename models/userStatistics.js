const mongoose = require("mongoose");
const moment = require("moment");

const Schema = require("mongoose").Schema;

const userStatisticsSchema = new Schema({
    logInTimes: {type: Number, default: 0},
    visitedPages: {type: Number, default: 0},
    adminAttempts: {type: Number, default: 0},
    memberAttempts: {type: Number, default: 0},
    lastLogInTime: Date,
    lastLogOutTime: Date,
}, {timestamps: true});

userStatisticsSchema.virtual("registration_date_formatted").get(function() {
    return moment(this.createdAt).format("DD.MM.YYYY, h:mm:ss a");
});

userStatisticsSchema.virtual("last_log_in_time_formatted").get(function() {
    return moment(this.lastLogInTime).format("DD.MM.YYYY, h:mm:ss a");
});

userStatisticsSchema.virtual("last_log_out_time_formatted").get(function() {
    return moment(this.lastLogOutTime).format("DD.MM.YYYY, h:mm:ss a");
});

module.exports = mongoose.model("user-statistics", userStatisticsSchema);