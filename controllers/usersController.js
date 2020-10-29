// doplniť konfigurácie (drop shadow atď...) pre post
const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// models
const Posts = require("../models/post");
const PostConfigs = require("../models/postConfig");
const Users = require("../models/users");


exports.users_get = (req,res,next) => {
    res.redirect("/");
}

exports.user_get = (req,res,next) => {
    Promise.all([
        Users.findById(req.params.profileId).populate("statistics"),
        Posts.find({user: req.params.profileId}).populate("config"),
    ])
        .then(results =>{
            const [user, allPosts] = results;
            if(!user) return res.redirect("/");
            res.render("profile",{title: user.userName, user, statistics: user.statistics, allPosts})
        })
        .catch(next);
}

exports.adminConfig_post = (req,res,next) => {
    res.send("configs");
}
const postValidation =[
    body(["postTitle","postBody","titleTextColor", "titleShadowColor","bodyTextColor","bodyShadowColor"]).trim().escape(),
    body(["titleTextColor", "titleShadowColor","bodyTextColor","bodyShadowColor"], "not valid hexadecimal number").isHexColor(),
]
exports.createPost_post = [
    postValidation,
    (req,res,next) => {
        // eliminating unauthenticated users
        if(!req.user){
            return res.redirect("/auth/log-in");
        }
        const {postTitle,postBody,titleTextColor,titleShadowColor,bodyTextColor,bodyShadowColor} = req.body;
        console.log(!titleShadowColor)
        const errors = validationResult(req);
        const post = new Posts({
            title: postTitle,
            body: postBody,
            user: req.user,
        });
        
        // in this if statement we ask if errors.isNotEmpty and if its not
        // it means that some of the values are not hex. That is the only condition
        // we asked for. But then we need to check if the error is not caused by shadow colors,
        // because their default value is not hexadecimal, rather empty string.
        if(!errors.isEmpty() && titleShadowColor && bodyShadowColor){
            return res.redirect("/");
        }
        let postConfig;
        if(req.user.isMember){
            postConfig = new PostConfigs({
                title: {
                    textColor: titleTextColor,
                    hasShadow: !!titleShadowColor,
                    shadowColor: titleShadowColor,
                    // shadow size will cannot be changed even if the user is member
                    // so we leave it to be always its default value
                },
                body: {
                    textColor: bodyTextColor,
                    hasShadow: !!bodyShadowColor,
                    shadowColor: bodyShadowColor,
                },
            })
        }
        else{
            postConfig = new PostConfigs(); // with all its default values
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

exports.updatePost_get = (req,res,next) => {
    if(!req.user){
        return res.redirect("/auth/log-in")
    }
    if(!mongoose.isValidObjectId(req.params.profileId) || !mongoose.isValidObjectId(req.params.postId)
         || req.user._id.toString() !== req.params.profileId){
        return res.redirect("/");
    }
    Promise.all([
        Users.findById(req.params.profileId),
        Posts.findById(req.params.postId).populate("config"),
    ])
        .then(results =>{
            const [user, post] = results;
            // checking whether the post and user even exsists, if so
            // checking if the logged in user is the owner of the profile user,
            // otherwise not allow to update the post
            if(!user || !post || user._id.toString() !== req.user._id.toString()) return res.redirect("/")

            res.render("post_form",{title: "Update post", post, config: post.config});
        })
        .catch(next);
}

exports.updatePost_post =[
    postValidation,
    (req,res,next) => {
        if(!req.user){
            return res.redirect("/auth/log-in");
        }
        if(!mongoose.isValidObjectId(req.params.profileId) || !mongoose.isValidObjectId(req.params.postId)
        || req.user._id.toString() !== req.params.profileId){
            return res.redirect("/");
        }
        const errors = validationResult(req);
        const {postTitle,postBody,titleTextColor,titleShadowColor,bodyTextColor,bodyShadowColor} = req.body;
        
        const updatedPost = {
            title: postTitle,
            body: postBody,
            edited: true,
        };
        if(!errors.isEmpty() && titleShadowColor && bodyShadowColor){
            return res.redirect("");
        }
        let updatedPostConfig;
        if(req.user.isMember){
            PostConfigs
            updatedPostConfig ={
                title: {
                    textColor: titleTextColor,
                    hasShadow: !!titleShadowColor,
                    shadowColor: titleShadowColor,
                },
                body: {
                    textColor: bodyTextColor,
                    hasShadow: !!bodyShadowColor,
                    shadowColor: bodyShadowColor,
                },
            }
        }
        Posts.findByIdAndUpdate(req.params.postId,updatedPost,{useFindAndModify: false})
            .then(post =>{
                return PostConfigs.findByIdAndUpdate(post.config,req.user.isMember ? updatedPostConfig : {},{useFindAndModify: false})
            })
            .then(config =>{
                res.redirect(req.user.url+"#"+req.params.postId)
            })
            .catch(next);
    }
]

exports.deletePost_post = (req,res,next) => {
    const {profileId,postId} = req.params;
    
    if(req.user._id.toString() !== profileId.toString() && !req.user.isAdmin){
        res.send("unauthorized");
    }else{
        Posts.findByIdAndRemove(postId,{useFindAndModify: false})
            .then(product =>{
                res.redirect(req.user.url);
            })
            .catch(next);
    }
}