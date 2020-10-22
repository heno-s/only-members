const mongoose = require("mongoose");

const Schema = require("mongoose").Schema;

const adminConfigSchema = new Schema({
    adminMode: {type: Boolean, default: true},
    user: {type: mongoose.Types.ObjectId, ref: "user", required: true},
});


module.exports = mongoose.model("admin-config", postSchema);