const express = require("express")
const router  = express.Router()
const Blog = require("../models/blog")
const middleware = require("../middleware")


//INDEX
router.get("/", (req, res)=>{
    Blog.find({}, (err, allBlogs)=>{
       if(err){
           console.log(err)
       } else {
          res.render("blogs/index",{blogs:allBlogs})
       }
    })
})

//CREATE 
router.post("/", middleware.isLoggedIn, (req, res)=>{
    var name = req.body.name
    var image = req.body.image
    var desc = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    } 
    Blog.create({name: name, image: image, description: desc, author:author}, (err, newlyCreated)=>{
        if(err){
            console.log(err)
        } else {
            console.log(newlyCreated)
            res.redirect("/blogs")
        }
    })
})

//NEW 
router.get("/new", middleware.isLoggedIn, (req, res)=>{
   res.render("blogs/new")
})

// SHOW 
router.get("/:id", (req, res)=>{
    Blog.findById(req.params.id).populate("comments").exec((err, foundBlog)=>{
        if(err){
            console.log(err)
        } else {
            console.log(foundBlog)
            res.render("blogs/show", {blog: foundBlog})
        }
    })
})

// EDIT 
router.get("/:id/edit", middleware.checkBlogOwnership, (req, res)=>{
    Blog.findById(req.params.id, (err, foundBlog)=>{
        res.render("blogs/edit", {blog: foundBlog})
    })
})

// UPDATE 
router.put("/:id",middleware.checkBlogOwnership, (req, res)=>{
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, updatedBlog)=>{
       if(err){
           res.redirect("/blogs")
       } else {
           //redirect somewhere(show page)
           res.redirect("/blogs/" + req.params.id)
       }
    })
})

// DESTROY 
router.delete("/:id",middleware.checkBlogOwnership, (req, res)=>{
   Blog.findByIdAndRemove(req.params.id, (err)=>{
      if(err){
          res.redirect("/blogs")
      } else {
          res.redirect("/blogs")
      }
   })
})


module.exports = router

