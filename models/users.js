const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const moment = require("moment");

const userSchema = new Schema({
    userName: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: String,
    password: {type: String, required: true},
    profilePictureUrl: {type: String, default: "/images/users/profile-picture.png"},

    isMember: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    highestRank: String,
    statistics: {type: mongoose.Types.ObjectId, ref: "user-statistics", required: true}
}, {timestamps: true});

userSchema.virtual("fullName").get(function() {
    return this.firstName + " " + this.lastName;
});

userSchema.virtual("url").get(function(){
    return `/users/${this._id}`;
});

module.exports = mongoose.model("user", userSchema);