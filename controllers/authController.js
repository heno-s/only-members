const { body,validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// models
const Users = require("../models/users");

/* passport setup */
passport.use(
    new LocalStrategy({usernameField: "userName"},(userName,password,done) =>{
      Users.findOne({userName})
        .then(user =>{
          if(!user){
            return done(null,false,{message: "Incorrect username"});
          }
          bcrypt.compare(password,user.password)
            .then(success =>{
              if(!success){
                return done(null,false,{message: "Incorrect password"});
              }
              else{
                return done(null,user);
              }
            })
            .catch(done);
        })
        .catch(done);
  })
  );
  
exports.auth_get = (req,res,next) => {
    res.redirect("/");
}

exports.register_get = (req,res,next) => {
    res.render("register", {title: "Registration"})
}

exports.register_post =  [
body(["userName", "firstName","password"], " field must not be empty").isLength({min: 1}).escape(),
body(["userName","firstName","lastName"], " field cannot be longer than 25 characters").isLength({max: 25}).escape(),
body("confirmPassword").escape(),
(req,res,next) =>{
    const errors = validationResult(req);
    // i have to do the match check on my own, because body.equals does not work
        if(req.body.password !== req.body.confirmPassword){
            errors.errors.push({
                value: req.body.password + " != " + req.body.confirmPassword,
                msg: "passwords do not match",
                param: "password",
                location: "body",
            });
        }
    const {userName,firstName,lastName,password} = req.body;
    const user = new Users({
        userName,
        firstName,
        lastName,
        password,
    });
    if(!errors.isEmpty()){
        return res.render("register", {title: "Registration",user, errors: errors.array()});
    }
    else{
        bcrypt.hash(password,10)
            .then(hashedPassword =>{
                user.password = hashedPassword;
                user.save((err,product) =>{
                    if(err) return next(err);
                    res.redirect("/auth/log-in");
                })
            })
            .catch(next)
    }
}
]

exports.logIn_get = (req,res,next) => {
    res.render("log-in", {title: "Log in"})
}

exports.logIn_post =[
    body(["userName", "password"], " field must not be empty").isLength({min: 1}).escape(),
    (req,res,next) => {
        const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.render("log-in", {title: "Log in", errors: errors.array()})
        }else{
            passport.authenticate("local", {successRedirect: "/",failureRedirect: "/auth/log-in"})(req,res,next);
        }
    }
]

exports.logOut_post = (req,res,next) => {
  req.logout();
  res.redirect("/auth/log-in");
}