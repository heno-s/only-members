const { body, validationResult } = require("express-validator");

// models
const Posts = require("../models/post");
const MemberConfigs = require("../models/memberConfig");

exports.users_get = (req,res,next) => {
    return res.render("profile", {title: "profile"});
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
    let memberConfig;
    if(req.user.isMember){
        memberConfig = new MemberConfigs({
            titleColor,
            bodyColor,
        })
    }
    else{
        memberConfig = new MemberConfigs();
    }
    console.log("post", post)
    post.config = memberConfig;
    post.save()
        .then(product =>{
            res.redirect("/");
        })
        .catch(next);
}]

exports.user_get = (req,res,next) => {

}

exports.adminConfig_post = (req,res,next) => {
    
}

exports.updatePost_get = (req,res,next) => {

}

exports.updatePost_post = (req,res,next) => {

}

exports.deletePost_post = (req,res,next) => {

}