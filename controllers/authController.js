const Users = require("../models/users");


exports.auth_get = (req,res,next) => {
    res.redirect("/");
}

exports.register_get = (req,res,next) => {
    res.render("register", {title: "Registration"})
}

exports.register_post = (req,res,next) => {
    
}

exports.logIn_get = (req,res,next) => {
    res.render("log-in", {title: "Log in"})
}

exports.logIn_post = (req,res,next) => {
    
}

exports.logOut_post = (req,res,next) => {

}