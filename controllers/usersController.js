// doplniť konfigurácie (drop shadow atď...) pre post
const { body, validationResult } = require("express-validator");

// models
const Posts = require("../models/post");
const PostConfigs = require("../models/postConfig");


exports.users_get = (req,res,next) => {
    res.redirect("/");
}
exports.createPost_post = [
body(["postTitle","postBody","titleColor","contentColor"]).trim().escape(),
(req,res,next) => {
    const {postTitle,postBody,titleColor,bodyColor} = req.body;
    const post = new Posts({
        title: postTitle,
        body: postBody,
        user: req.user,
    });
    let postConfig;
    if(req.user.isMember){
        postConfig = new PostConfigs({
            titleColor,
            bodyColor,
        })
    }
    else{
        postConfig = new PostConfigs();
    }
    post.config = postConfig;
    Promise.all([
        postConfig.save(),
        post.save(),
    ])
        .then(product =>{
            res.redirect("/");
        })
        .catch(next);
}]

exports.user_get = (req,res,next) => {
res.send("user");
}

exports.adminConfig_post = (req,res,next) => {
    res.send("configs");
}

exports.updatePost_get = (req,res,next) => {
    res.send("update get");
}

exports.updatePost_post = (req,res,next) => {
    res.send("update post");
}

exports.deletePost_post = (req,res,next) => {
    const {profileId,postId} = req.params;
    
    if(req.user._id !== profileId && !req.user.isAdmin){
        res.send("unauthorized");
    }else{
        Posts.findByIdAndRemove(postId,{useFindAndModify: false})
            .then(product =>{
                res.redirect("/");
            })
            .catch(next);
    }
}