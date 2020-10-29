const mongoose = require("mongoose");
const moment = require("moment");

const Schema = require("mongoose").Schema;

const postSchema = new Schema({
    title: String,
    body: String,
    edited: Boolean,
    user: {type: mongoose.Types.ObjectId, ref: "user", required: true},
    config: {type: mongoose.Types.ObjectId, ref: "post-config", required: true},
},{timestamps: true});

postSchema.virtual("created_at_formatted").get(function(){
    return moment(this.createdAt).format("DD.MM.YYYY, h:mm:ss a");
});

postSchema.virtual("edited_at_formatted").get(function(){
    return moment(this.updatedAt).format("DD.MM.YYYY, h:mm:ss a");
});

postSchema.virtual("url").get(function(){
    return `/users/${this.user._id}/posts/${this._id}`;
});

module.exports = mongoose.model("post", postSchema);