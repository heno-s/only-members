const Users = require("../models/users");

exports.boards_get = (req,res,next) => {
    res.redirect("/");
}

exports.clubMembers_get = (req,res,next) => {
Users.find({isMember: true})
    .then(memberUsers =>{
        let me = memberUsers.shift();
        memberUsers.push(me);
        res.render("membersList", {title: "club members",memberUsers});
    })
    .catch(next);
}

exports.admins_get = (req,res,next) => {
Users.find({isAdmin: true})
    .then(adminUsers =>{
        let me = adminUsers.shift();
        adminUsers.push(me);
        res.render("adminsList", {title: "admins",adminUsers});
    })
    .catch(next);
}