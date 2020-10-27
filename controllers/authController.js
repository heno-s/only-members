const { body,validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// models
const Users = require("../models/users");
const UserStatistics = require("../models/userStatistics");

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
body(["userName", "firstName","password"], " field must not be empty").trim().isLength({min: 1}).escape(),
body(["userName","firstName","lastName"], " field cannot be longer than 25 characters").trim().isLength({max: 25}).escape(),
body("confirmPassword").trim().escape(),
// needed to make the function async for convenience of identifying whether username is already in the database
async (req,res,next) =>{
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

    // made a helper variable for perfomance increase so i don't have to check for
    // existence of user name in the DB if inputs didn't passed the validation
    let userExists
    if(!errors.isEmpty() || ( userExists = await Users.exists({userName}))){
        return res.render("register", {title: "Registration",user,userExists, errors: errors.array()});
    }
    
    else{
        const userStatistics = new UserStatistics({user});
        bcrypt.hash(password,10)
            .then(hashedPassword =>{
                user.password = hashedPassword;
                user.statistics = userStatistics;
                Promise.all([
                    userStatistics.save(),
                    user.save(),
                ])
                    .then(products =>{
                        res.redirect("/auth/log-in");
                    })
                    .catch(next);
            })
            .catch(next)
    }
}
]

exports.logIn_get = (req,res,next) => {
    res.render("log-in", {title: "Log in"})
}

exports.logIn_post = (req,res,next) => {
    const {userName,password} = req.body;
    
    passport.authenticate("local",

    (err,user,info) =>{
        if(err) return next(err);
        else if (!user){
            return res.render("log-in", { title: "Log in",notFound: true, inputs: {userName,password},msg: info.message})
        }
        else {
            req.logIn(user, function(err) {
                if (err) return next(err); 
                UserStatistics.findById(user._id)
                    .then(statistic =>{
                        console.log("exports.logIn_post -> statistic", statistic)
                    })

                UserStatistics.findByIdAndUpdate(user._id,{lastLogInTime: new Date()},{useFindAndModify: false})
                    .catch(next)
                    return res.redirect("/");
            });
        }

    })(req,res,next);
}

exports.logOut_post = (req,res,next) => {
    
    UserStatistics.findByIdAndUpdate(req.user,{lastLogOutTime: new Date()},{useFindAndModify: false})
        .catch(next);
  req.logout();
  res.redirect("/auth/log-in");
}