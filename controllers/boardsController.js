exports.boards_get = (req,res,next) => {
    res.redirect("/");
}

exports.clubMembers_get = (req,res,next) => {
    res.render("membersAdminsList", {title: "club members"});
}

exports.admins_get = (req,res,next) => {
    res.render("membersAdminsList", {title: "admins"});
}