const mongoose = require("mongoose");
const moment = require("moment");

const Schema = require("mongoose").Schema;

const postSchema = new Schema({
    title: String,
    content: String,
    edited: Date,
    user: {type: mongoose.Types.ObjectId, ref: "user", required: true},
    config: {type: mongoose.Types.ObjectId, ref: "member-config", required: true},
},{timestamps: true});

postSchema.virtual("created_at_formatted").get(function(){
    return moment(this.createdAt).format("DD.MM.YYYY");
});

postSchema.virtual("edited_at_formatted").get(function(){
    return moment(this.createdAt).format("DD.MM.YYYY");
});

postSchema.virtual("url").get(function(){
    return `/user/${this.user}/posts/${this._id}`;
});

module.exports = mongoose.model("post", postSchema);