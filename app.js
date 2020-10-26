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

// environment variables
const {MONGODB_URI, SECRET_KEY} = process.env;

// standard variables
const adminLimit = 5;

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
// global res.locals variables
app.use((req,res,next) =>{
  res.locals.adminLimit = adminLimit;
  next();
});

app.use((req,res,next) =>{
  res.locals.currentUser = req.user;
  next();
});

app.use((req,res,next) =>{
  AppStatistics.findOne()
    .then(statistics =>{
      if(req.method == "GET")
        statistics.visitedPages ++;
      else if(req.method === "POST")
        statistics.pageSubmissions ++;
      else
        return;
      statistics.save((err,product) =>{
        if(err) return next(err);
      });
    })
    .catch(next)

    next();
});

// using routers
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
