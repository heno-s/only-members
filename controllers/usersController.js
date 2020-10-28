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

exports.createPost_post = [
    body(["postTitle","postBody","titleTextColor", "titleShadowColor","bodyTextColor","bodyShadowColor"]).trim().escape(),
    body(["titleTextColor", "titleShadowColor","bodyTextColor","bodyShadowColor"], "not valid hexadecimal number").isHexColor(),
    (req,res,next) => {
        if(!req.user){
            return res.redirect("/auth/log-in");
        }
        const {postTitle,postBody,titleTextColor,titleShadowColor,bodyTextColor,bodyShadowColor} = req.body;
        console.log("bodyShadowColor", bodyShadowColor)
        console.log("bodyTextColor", bodyTextColor)
        console.log("titleShadowColor", titleShadowColor)
        console.log("titleTextColor", titleTextColor)
        const errors = validationResult(req);
        const post = new Posts({
            title: postTitle,
            body: postBody,
            user: req.user,
        });
        console.log(errors.array())
        if(!errors.isEmpty() && titleShadowColor !== "none" && bodyShadowColor !== "none"){
            console.log(!errors.isEmpty() && titleShadowColor !== "none" && bodyShadowColor !== "none")
            return res.redirect("/");
        }
        let postConfig;
        if(req.user.isMember){
            postConfig = new PostConfigs({
                titleColors: {
                    text: titleTextColor,
                    shadow: titleShadowColor,
                },
                bodyColors: {
                    text: bodyTextColor,
                    shadow: bodyShadowColor,
                },
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

exports.updatePost_get = (req,res,next) => {
    if(!mongoose.isValidObjectId(req.params.profileId) || !mongoose.isValidObjectId(req.params.postId)
        || !req.user){
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