const { body, validationResult } = require("express-validator");
const mongoose = require("mongoose");

// models
const Posts = require("../models/post");
const EditedPosts = require("../models/editedPost");
const EditedPostConfig = require("../models/editedPostConfig");
const PostConfigs = require("../models/postConfig");
const Users = require("../models/users");


exports.users_get = (req,res,next) => {
    res.redirect("/");
}

exports.user_get = (req,res,next) => {
    if(!mongoose.isValidObjectId(req.params.profileId)){
        return res.send("No user found in the database");
    }
    Promise.all([
        Users.findById(req.params.profileId).populate("statistics"),
        Posts.find({user: req.params.profileId})
            .populate("config")
            .populate("editedVersion")
            .populate({
                path: "editedVersion",
                populate: {
                    path: "editedConfig",
                    model: "edited-post-config"
                }
            }),
    ])
        .then(results =>{
            const [user, allPosts] = results;
            if(!user) return res.send("No user found in the database");
            
            res.render("profile",{title: user.userName, user, statistics: user.statistics, allPosts})
        })
        .catch(next);
}

exports.adminConfig_post = (req,res,next) => {
    res.send("configs");
}
const postValidation =[
    body(["postTitle","postBody","titleTextColor", "titleShadowColor","bodyTextColor","bodyShadowColor"]).trim().escape(),
    body(["titleTextColor", "titleShadowColor","bodyTextColor","bodyShadowColor"],"not valid hexadecimal number").isHexColor(),
]
exports.createPost_post = [
    postValidation,
    (req,res,next) => {
        // eliminating unauthenticated users
        if(!req.user){
            return res.redirect("/auth/log-in");
        }
        const {postTitle,postBody,titleTextColor,titleShadowColor,bodyTextColor,bodyShadowColor} = req.body;
        const errors = validationResult(req);
        const post = new Posts({
            title: postTitle,
            body: postBody,
            user: req.user,
        });
        
        // in this if statement we ask if errors.isNotEmpty and if its not
        // it means that some of the values are not hex. That is the only condition in validating
        // we asked for. But then we need to check if the error is not caused by shadow colors,
        // because their default value is not hexadecimal, rather empty string.
        if(!errors.isEmpty() && titleShadowColor && bodyShadowColor){
            return res.send("Do not try to hack it!");
        }
        let postConfig;
        if(req.user.isMember){
            postConfig = new PostConfigs({
                title: {
                    textColor: titleTextColor,
                    hasShadow: !!titleShadowColor,
                    shadowColor: titleShadowColor,
                    // shadow size cannot be changed even if the user is member
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
    // assuring that the id we got is validobject id, otherwise, we would get mongoose error
    // while searching for invalid id argument
    if(!mongoose.isValidObjectId(req.params.profileId) ||
        !mongoose.isValidObjectId(req.params.postId)){
        return res.redirect("/");
    }
    if(req.user._id.toString() !== req.params.profileId){
        return res.send("unauthorized");
    }
    Promise.all([
        Users.findById(req.params.profileId),
        Posts.findById(req.params.postId).populate("config"),
        EditedPosts.findById(req.params.postId).populate("editedConfig"),
    ])
        .then(results =>{
            const [user, post, editedVersion] = results;

            if(!user){
                return res.send("No owner of this post found in the database")
            }
            if(!post  && !editedVersion){
                return res.send("No post found. The post you are looking for might be deleted")
            }
            if(user._id.toString() !== req.user._id.toString()){
                return res.send("You are not allowed to update someone elses post")
            }

            if(editedVersion){
                return res.render("post_form_update",{title: "Update post", post: editedVersion, config: editedVersion.editedConfig});
            }
            res.render("post_form_update",{title: "Update post", post, config: post.config});
        })
        .catch(next);
}

exports.updatePost_post =[
    postValidation,
    (req,res,next) => {
        if(!req.user){
            return res.redirect("/auth/log-in");
        }
        if(!mongoose.isValidObjectId(req.params.profileId) || !mongoose.isValidObjectId(req.params.postId)){
            return res.redirect("/");
        }
        if(req.user._id.toString() !== req.params.profileId){
            return res.send("You are not allowed to update someone elses post")
        }
        const errors = validationResult(req);
        const {postTitle,postBody,titleTextColor,titleShadowColor,bodyTextColor,bodyShadowColor} = req.body;
        
        const updatedPost = {
            title: postTitle,
            body: postBody,
        };
        if(!errors.isEmpty() && titleShadowColor && bodyShadowColor){
            return res.redirect("");
        }
        
        let updatedPostConfig;
        if(req.user.isMember){
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
        Promise.all([
            Posts.findById(req.params.postId),
            EditedPosts.findById(req.params.postId),
        ])
            .then(results =>{
                const [originalPost, editedPost] = results;
                if(!originalPost && !editedPost) return res.send("No such post found in the database");
                if(!originalPost){
                        editedPost.updateOne(updatedPost)
                            .then(result =>{ 
                                // only members are allowed to update their configs
                                if(req.user.isMember){
                                    return EditedPostConfig.findByIdAndUpdate(editedPost.editedConfig,updatedPostConfig , {useFindAndModify: false})    
                                }
                                res.redirect("/")
                            })
                            .then(editedConfig =>{
                                res.redirect(req.user.url);
                            })
                            
                            .catch(next);
                }
                else{
                    // reassuring no one can hack with fetch and send id of original post
                    // with edited version, because if it already has edited version, we
                    // want to modify that edited version and not creating new one.
                    if (originalPost.hasEditedVersion){
                        return res.redirect("Do not try to hack it!");
                    }
                    new EditedPostConfig(updatedPostConfig).save()
                        .then(createdEditedConfig => {
                            // req.user is always currently logged in user and users can only update
                            // their posts, not someone elses so it is ok to say that owner of
                            // updated post is just currently logged in.
                            updatedPost.user = req.user
                            updatedPost.editedConfig = createdEditedConfig;
                            return new EditedPosts(updatedPost).save();
                        })
                        .then(createdEditedPost =>{
                            originalPost.hasEditedVersion = true;
                            originalPost.editedVersion = createdEditedPost;
                            return originalPost.save()
                        })
                        .then(originalPostUpdated =>{
                            return res.redirect(req.user.url)
                        })
                        .catch(next);

                }
            })
            .catch(next);
    }
]

exports.deletePost_post = (req,res,next) => {
    const {profileId,postId} = req.params;
    let redirectPath = req.body.redirectPath;
    console.log("exports.deletePost_post -> redirectPath", redirectPath)
    if(!req.user)
        return res.redirect("/auth/log-in")
    if(req.user._id.toString() !== profileId.toString() && !req.user.isAdmin)
        return res.redirect("unauthorized");
    Promise.all([
        Posts.findById(postId),
        EditedPosts.findById(postId),
        
    ])
        .then(results =>{
            const [post, editedVersion] = results;
            // eliminating fetch hack with original post id with edited version
            if(post && !post.hasEditedVersion){
                return post.remove();
            } else if(editedVersion){
                return Promise.all([
                    Posts.findOneAndUpdate({editedVersion}, {hasEditedVersion: false}, {useFindAndModify: false}),
                    editedVersion.remove(),
                ])
            }
            res.send("No such item found in database")
        })
            .then(results =>{
                
                res.redirect(redirectPath ? redirectPath : "/")
            })
            .catch(next);
    
}