const express = require("express");

const router = express.Router();

const { ensureAuthenticated } = require("../config/auth");

// Welcome Page 
router.get("/", (req , res)=>{
    res.render("home");
});
// About Page
router.get("/about" , (req , res)=>{
    res.render("about");
})
// Sign_in Page
router.get("/users/", (req , res)=>{
    res.render("welcome");
});
// DashBoard Page
router.get("/dashboard", ensureAuthenticated , (req , res)=>{
    res.render("dashboard" , {
        name : req.user.name 
    }
    );
});

module.exports = router;