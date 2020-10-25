exports.benefits_get = (req,res,next) => {
    res.redirect("/");
}


exports.joinTheClub_get = (req,res,next) => {
    res.render("memberSecret", {title: "become club member"});
}

exports.joinTheClub_post = (req,res,next) => {
    
}

exports.becomeAnAdmin_get = (req,res,next) => {
    res.render("adminPassword", {title: "become admin"});
}

exports.becomeAnAdmin_post = (req,res,next) => {
    
}

