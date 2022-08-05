if (process.env.NODE_ENV !== "production"){
    require ("dotenv").config();
}

const express = require("express");
const path = require("path");
const engine = require('ejs-mate');
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/expressError");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const campgroundRoutes = require('./routes/campgroundRoutes');
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes")
const User = require("./models/user");
const mongoSanitize = require('express-mongo-sanitize');
const MongoStore = require('connect-mongo');

// const MongoDBStore = require("connect-mongo")(session);

// const helmet = require("helmet");

 const MONGO_URI = 'mongodb://localhost:27017/camp' || process.env.MONGO_URI;
// const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(process.env.MONGO_URI, {
     useNewUrlParser: true,
    //  useCreateIndex: true,
     useUnifiedTopology: true,
    //  useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () =>{
    console.log("Database connected");
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.engine('ejs', engine);
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  );
  
// use ejs-locals for all ejs templates:

const secret = process.env.SECRET || 'shouldbeconfidential';
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
 
store.on("error", function(e) {
    console.log("SESSION STORE ERROR")
});

const sessionConfig ={
    store,
    name: "Aalll", //Use a disguised name for security reason
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        httpOnly: true,
        // secure: true,     //only use when deploy
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000 * 60 * 60 * 24 * 7
    }
 }

app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ------------------------------------------------------------------------
// use local middleware to pass flash msg for all the routes applicable, put before route handlers
app.use((req, res, next) =>{
    console.log(req.query);
    // console.log(req.session);
    // We want to store the originalUrl in the session when user logedin.
    if(!["/login", "/campgrounds"].includes(req.originalUrl)){
        req.session.returnTo = req.originalUrl;
     }
    // const redirectUrl  = req.session.returnTo || "/campgrounds"
    // passport has req.user property when logged in
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

app.get('/', (req, res)=>{
    res.render("campgrounds/home");
})
// This only runs when everything was run and no error found!
app.all("*", (req, res, next) =>{
    next(new ExpressError("Page Not Found", 404));
});

// This is the bulit in Error class in Express. ExpressEroor.js extendeds This Error!
app.use((err, req, res, next) =>{
    // assign some default error value
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh, No, something is wrong!";
    
    // const {message ="Something went wrong", statusCode = 500} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error", { err });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=>{
    console.log(`Sever is listening at port ${PORT}`)
})