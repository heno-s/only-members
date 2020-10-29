// dependency variables
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressEjsLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const compression = require("compression");
const helmet = require("helmet");
require("dotenv").config();

// models
const Users = require("./models/users");
const AppStatistics = require("./models/appStatistics");
const UserStatistics = require("./models/userStatistics");

const PostConfig = require("./models/postConfig");
// environment variables
const {MONGODB_URI, SECRET_KEY} = process.env;

// standard variables
const adminsLimit = 10;


const textColors = {
  "default": "#ffffff",
  "black": "#000000",
  "member color": "#faff00",
  "admin color": "#004e8d",
  "light grey": "#c4c4c4c4",
  "red": "#ff0000",
  "green" : "#91C860",
}
// made separate object for shadow colors, because its default value is none
// and maybe for further flexibility, if i would like to change shadow colors 
// and let text colors be the way they were, or vice versa.
const shadowColors = {
  "none": "",
  "black": "#000000",
  "member color": "#faff00",
  "admin color": "#004e8d",
  "light grey": "#c4c4c4c4",
  "red": "#ff0000",
  "green" : "#91C860",
}

// router variables
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const benefitsRouter = require("./routes/benefits");
const boardsRouter = require("./routes/boards");

// mongoose connection
mongoose.connect(MONGODB_URI,{useUnifiedTopology: true, useNewUrlParser: true});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

passport.serializeUser((user,done) =>{
  done(null,user._id);
});

passport.deserializeUser((id,done) =>{
  Users.findById(id)
    .then(user =>{
      done(null,user);
    })
    .catch(done);
});
/* initializing express app and working with just app till the end */
const app = express();


/* app configuration */

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// express-ejs-layout config
app.set("layout", "layouts/main");



// security code for production
app.use(compression());
app.use(helmet());

app.use(logger("dev"));
app.use(session({secret: SECRET_KEY, resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressEjsLayouts);
app.use((req,res,next) =>{
  res.header("Content-Security-Policy", "*");
  next();
})

// custom app.js middleware functions
app.use(setGlobalVariables);
app.use(statistics);

// routers
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/benefits", benefitsRouter);
app.use("/boards", boardsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error", {layout: false});
});


module.exports = app;


// custom middleware functions

function setGlobalVariables(req,res,next){
  res.locals.adminsLimit = adminsLimit;
  res.locals.currentUser = req.user;
  res.locals.textColors = textColors;
  res.locals.shadowColors = shadowColors;
  next();
}

function statistics(req,res,next){
  // excluding public stylesheets images and javascripts as they are automatically being asked for by the
  // server and not by the user itself
  if(req.url.startsWith("/images") || req.url.startsWith("/stylesheets") || req.url.startsWith("/javascripts")){
    return next();
  }
  AppStatistics.findOne()
  .then(statistics =>{
      if(req.method == "GET")
        statistics.visitedPages ++;
      else if(req.method === "POST")
        statistics.pageSubmissions ++;
      else
        return;
      return statistics.save();
    })
    .catch(next)
    if(req.user && req.method === "GET"){
      UserStatistics.findById(req.user.statistics._id)
        .then(userStatistics =>{
          userStatistics.visitedPages ++;
          return userStatistics.save();
        })
        .catch(next);
    }
    
    next();
}

