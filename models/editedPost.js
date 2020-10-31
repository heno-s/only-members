const mongoose = require("mongoose");
const moment = require("moment");

const Schema = require("mongoose").Schema;

const editedPostSchema = new Schema({
    title: String,
    body: String,
    isEditedVersion: {type: Boolean, default: true},
    user: {type: mongoose.Types.ObjectId, ref: "user", required: true},
    editedConfig: {type: mongoose.Types.ObjectId, ref: "edited-post-config", required: true},
},{timestamps: true});

editedPostSchema.virtual("created_at_formatted").get(function(){
    return moment(this.createdAt).format("DD.MM.YYYY, h:mm:ss a");
});

editedPostSchema.virtual("edited_at_formatted").get(function(){
    return moment(this.updatedAt).format("DD.MM.YYYY, h:mm:ss a");
});

editedPostSchema.virtual("url").get(function(){
    return `/users/${this.user._id}/posts/${this._id}`;
});

module.exports = mongoose.model("edited-post", editedPostSchema);