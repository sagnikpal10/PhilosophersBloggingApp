const express = require("express")
const router  = express.Router()
const passport = require("passport")
const User = require("../models/user")

//root route
router.get("/", (req, res)=>{
    res.redirect('/blogs')
})

// render register form
router.get("/register", (req, res)=>{
   res.render("register")
})

//signup route
router.post("/register", (req, res)=>{
    var newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, (err, user)=>{
        if(err){
            console.log(err)
            return res.render("register")
        }
        passport.authenticate("local")(req, res, ()=>{
           res.redirect("/blogs")
        })
    })
})

//render login form
router.get("/login", (req, res)=>{
   res.render("login")
})

//login route
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }), (req, res)=>{
})

// logout route
router.get("/logout", (req, res)=>{
   req.logout()
   res.redirect("/blogs")
})

//to check if the user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

module.exports = router