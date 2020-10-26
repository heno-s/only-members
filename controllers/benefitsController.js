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
        Users.findByIdAndUpdate(user._id,user,{useFindAndModify: false})
            .then(updatedUser =>{
                res.redirect("/");
            })
            .catch(next);
    }else{
        res.render("memberSecret", {title: "Become club member", failed: true});
    }
}

exports.becomeAnAdmin_get = (req,res,next) => {
    Users.countDocuments({isAdmin: true})
        .then(numberOfAdmins =>{
            res.render("adminPassword", {title: "Become an admin", numberOfAdmins});
        })
        .catch(next);
}

exports.becomeAnAdmin_post = (req,res,next) => {
    if(req.body.password === ADMIN_KEY){
        const {user} = req;
        user.isAdmin = true;
        console.log("exports.becomeAnAdmin_post -> user", user)
        new adminConfigs({user}).save()
        .catch(next);
        
        // for whaever reason here does not work findByIdAndUpdate so
        // i have to do it like this, find update myself and save
        Users.findById(user._id)
            .then(user =>{
                user.isAdmin = true;
                return user.save();
            })
            .then(product =>{
                res.redirect("/");
            })
            .catch(next);
        
    } else{
        Users.countDocuments({isAdmin: true})
        .then(numberOfAdmins =>{
            res.render("adminPassword", {title: "Become an admin", numberOfAdmins, failed: true});
        })
        .catch(next);
    }
    
}

