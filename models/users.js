const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const moment = require("moment");

const userSchema = new Schema({
    userName: {type: String, required: true},
    firstName: {type: String, required: true},
    lastName: String,
    password: {type: String, required: true},
    profilePictureUrl: {type: String, default: "/images/user/profile-picture.png"},

    isMember: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
}, {timestamps: true});

userSchema.virtual("registration_date_formatted").get(function() {
    return moment(this.createdAt).format("DD.MM.YYYY");
});

userSchema.virtual("fullName").get(function() {
    return this.firstName + " " + this.lastName;
});

userSchema.virtual("url").get(function(){
    return `/user/${this._id}`;
});

module.exports = mongoose.model("user", userSchema);