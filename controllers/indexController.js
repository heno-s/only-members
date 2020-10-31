const Posts = require("../models/post");

exports.index_get = (req,res,next) => {
    Posts.find()
        .populate("user")
        .populate("config")
        .populate("editedVersion")
        // for populating subdocument's refs we need to use different syntax
        .populate({
            path: "editedVersion",
            populate:{
                path: "editedConfig",
                model: "edited-post-config"
            }
        })
            .then(allPosts =>{            
                res.render("index", { title: "Only Members", allPosts})
            })
            .catch(next);
}
