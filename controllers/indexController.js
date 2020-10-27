const Posts = require("../models/post");

exports.index_get = (req,res,next) => {
    Posts.find().populate("user").populate("config")
        .then(allPosts =>{            
            res.render("index", { title: "Only Members", allPosts})
        })
        .catch(next);
}
