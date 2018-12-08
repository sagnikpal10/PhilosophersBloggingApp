const express     = require("express"),
      app         = express(),
      bodyParser  = require("body-parser"),
      mongoose    = require("mongoose"),
      passport    = require("passport"),
      LocalStrategy = require("passport-local"),
      methodOverride = require("method-override"),
      Blog  = require("./models/blog"),
      Comment     = require("./models/comment"),
      User        = require("./models/user"),
      commentRoutes    = require("./routes/comments"),
      blogRoutes = require("./routes/blogs"),
      indexRoutes      = require("./routes/index")
   
mongoose.connect("mongodb://localhost/blog_app")
app.use(bodyParser.urlencoded({extended: true}))
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "This is a secret message !",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next)=>{
   res.locals.currentUser = req.user
   next()
});

app.use("/", indexRoutes)
app.use("/blogs", blogRoutes)
app.use("/blogs/:id/comments", commentRoutes)


app.listen(3000, ()=>{
   console.log("The web Server Has Started running on http://localhost:3000/")
})
