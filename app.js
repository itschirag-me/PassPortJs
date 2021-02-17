const express = require("express");

const app = express();

const routes = require("./routes/index");

const users  = require("./routes/users");

const PORT = process.env.PORT || 5000;

const expressLayouts = require("express-ejs-layouts");

const mongoose = require("mongoose");

const db = require("./config/keys").MongoURI;

const flash = require("connect-flash");

const session = require("express-session");

const passport = require("passport");
// PassPort Config
require('./config/passport')(passport);


// Mongoose DB
mongoose.connect(db , { useNewUrlParser: true })
    .then(()=> console.log("Mongoose connected..."))
    .catch((err)=> console.log(err));
// EJS
app.use(expressLayouts); 
app.set("view engine" , 'ejs');


// BodyParser
app.use(express.urlencoded({extended : false}));

// Express Session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
  }));

// PassPortJS middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect Flash
app.use(flash());

// Global Var
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
// Routes
app.use("/" , routes );

app.use("/users" , users );

app.listen(PORT , ()=>{
    console.log("Running on http://localhost:5000");
})