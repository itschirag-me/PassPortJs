const express = require("express");

const router = express.Router();

const User = require('../models/User');

const bcrypt = require("bcryptjs");

const passport = require("passport");

router.get("/login", (req , res)=>{
    res.render("login");
});
router.get("/register", (req , res)=>{
    res.render("register");
});

router.post('/register' , (req , res)=>{
    // console.log(req.body);
    const { name , email , password , password2 } = req.body;
    let errors = [];

    // check required fields
    if(!name || !email || !password || !password) {
        errors.push({ msg : "Please fill in all fields"});
    }

    // check password match with password2
    if(password !== password2) {
        errors.push({ msg : "Password do not match"});
    }

    // check password length
    if(password.length < 6) {
        errors.push({ msg : "Password should be at least 6 characters"})
    }
    
    if(errors.length > 0 ) {
        res.render("register" , {
            errors,
            name,
            email,
            password,
            password2 
        });
    } else {
        User.findOne({email : email })
            .then(user=> {
                if(user) {
                    // User Exist
                    errors.push({ msg : "Email is already exist!"})
                    res.render("register" , {
                        errors,
                        name,
                        email,
                        password,
                        password2 
                    });
                } else {
                    const newUser = new User({
                      name,
                      email,
                      password
                    });                    
                    // Hash PassWord
                    bcrypt.genSalt( 10 , (err, salt)=>bcrypt.hash(newUser.password , salt , (err , hash)=>{
                        if(err) throw err;
                        // Set Password to Hased
                        newUser.password = hash;
                        // Save user
                        newUser.save()
                            .then(user =>{
                                req.flash('success_msg' , 'You are now Register you can login now');
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    }));
                }
            })
    }
});

// Login Handle

router.post('/login' , (req , res , next)=>{
    passport.authenticate('local' , {
        successRedirect : "/dashboard" , 
        failureRedirect : "/users/login" , 
        failureFlash : true 
    }) (req , res , next);
});

// Logout Handle

router.get('/logout' , (req ,res , next)=>{
    req.logout();
    req.flash("success_msg" , "You are logged out");
    res.redirect("/users/login")
})

module.exports = router;