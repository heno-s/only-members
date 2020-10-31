const { ADMIN_PASSWORD, MEMBER_KEY } = process.env;
const Users = require("../models/users");
const AdminConfigs = require("../models/adminConfig");
const UserStatistics = require("../models/userStatistics");

exports.benefits_get = (req,res,next) => {
    res.redirect("/");
}


exports.becomeMember_get = (req,res,next) => {
    if(!req.user){
        return res.redirect("/auth/log-in");
    }
    res.render("memberSecret", {title: "Become club member"});
}

exports.becomeMember_post = (req,res,next) => {
    if(!req.user){
        return res.redirect("/auth/log-in");
    }
    else if(req.user.isMember){
        return res.redirect("/benefits/join-the-club");
    }
    UserStatistics.findById(req.user.statistics)
        .then(statistics =>{
            statistics.memberAttempts ++;
            return statistics.save();
        })
        .catch(next);

        console.log(req.body.password)
        console.log(MEMBER_KEY)
    if(req.body.password === MEMBER_KEY){
        const {user} = req;
        user.isMember = true;
        user.highestRank = user.isAdmin ? "admin" : "member";
        Users.findByIdAndUpdate(user._id,user,{useFindAndModify: false})
            .then(updatedUser =>{
                res.redirect("/boards/club-members");
            })
            .catch(next);
    }else{
        res.render("memberSecret", {title: "Become club member", failed: true});
    }
}

exports.becomeAnAdmin_get = (req,res,next) => {
    if(!req.user){
        return res.redirect("/auth/log-in");
    }
    Users.countDocuments({isAdmin: true})
        .then(numberOfAdmins =>{
            res.render("adminPassword", {title: "Become an admin", numberOfAdmins});
        })
        .catch(next);
}

exports.becomeAnAdmin_post = (req,res,next) => {
    if(!req.user){
        return res.redirect("/auth/log-in");
    }
    else if(req.user.isAdmin){
        return res.redirect("/benefits/become-an-admin")
    }
    UserStatistics.findById(req.user.statistics)
        .then(statistics =>{
            statistics.adminAttempts ++;
            return statistics.save();
        })
        .catch(next);
    if(req.body.password === ADMIN_PASSWORD){
        const {user} = req;
        user.isAdmin = true;
        user.highestRank = "admin";
        new AdminConfigs({user}).save()
        .catch(next);
        
        Users.findByIdAndUpdate(user._id,{isAdmin: true},{useFindAndModify: false})
            .then(product =>{
                res.redirect("/boards/admins");
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

