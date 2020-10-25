const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const moment = require("moment");

const userSchema = new Schema({
    userName: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    member: {type: Boolean, default: false},
    admin: {type: Boolean, default: false},
    profilePicture: {type: String, default: "/images/user/profile-picture.png"},
    lastLogInTime: Date,
    lastLogOutTime: Date,
}, {timestamps: true});

userSchema.virtual("registration_date_formatted").get(function() {
    return moment(this.createdAt).format("DD.MM.YYYY");
});

userSchema.virtual("last_log_in_time_formatted").get(function() {
    return moment(this.lastLogInTime).format("DD.MM.YYYY");
});

userSchema.virtual("last_log_out_time_formatted").get(function() {
    return moment(this.lastLogOutTime).format("DD.MM.YYYY");
});

userSchema.virtual("fullName").get(function() {
    return this.firstName + " " + this.lastName;
});

userSchema.virtual("url").get(function(){
    return `/user/${this._id}`;
});

module.exports = mongoose.model("user", userSchema);