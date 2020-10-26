const { ADMIN_KEY, MEMBER_KEY } = process.env;
const Users = require("../models/users");
const adminConfigs = require("../models/adminConfig");
const memberConfigs = require("../models/memberConfig");

exports.benefits_get = (req,res,next) => {
    res.redirect("/");
}


exports.becomeMember_get = (req,res,next) => {
    res.render("memberSecret", {title: "Become club member"});
}

exports.becomeMember_post = (req,res,next) => {
    if(req.body.password === MEMBER_KEY){
        const {user} = req;
        user.isMember = true;
        Users.findByIdAndUpdate(user._id,user)
            .then(updatedUser =>{
                res.redirect("/");
            })
            .catch(next);
    }else{
        res.render("memberSecret", {title: "Become club member", failed: true});
    }
}

exports.becomeAnAdmin_get = (req,res,next) => {
    Users.count({isAdmin: true})
        .then(numberOfAdmins =>{
            res.render("adminPassword", {title: "Become an admin", numberOfAdmins});
        })
        .catch(next);
}

exports.becomeAnAdmin_post = (req,res,next) => {
    if(req.body.password === ADMIN_KEY){
        const {user} = req;
        user.isAdmin = true;
        new adminConfigs({user}).save()
            .catch(next);

        Users.findByIdAndUpdate(user._id,user)
            .then(updatedUser =>{
                res.redirect("/");
            })
            .catch(next);
        
    } else{
        Users.count({isAdmin: true})
        .then(numberOfAdmins =>{
            res.render("adminPassword", {title: "Become an admin", numberOfAdmins, failed: true});
        })
        .catch(next);
    }
    
}

