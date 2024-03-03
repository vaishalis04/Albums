var express = require('express');
var router = express.Router();
const persons = require('../models/persons');
const picture = require('../models/media');
const passport = require('passport');
const localStratrgy = require('passport-local');
passport.use(new localStratrgy(persons.authenticate()));
const upload = require("../utils/multer").single("avatar");
var fs = require("fs");
const { error } = require('console');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {loginUser:req.user});
});
router.get('/signup', function(req, res, next) {
  const isUser = req.user
  if(isUser){
    res.redirect('/profile')
  } else {
    res.render('signup',{loginUser:req.user});
  }
});
router.post('/signup', async function(req, res, next) {
  try{
    await persons.register({
      username:req.body.username,
      email:req.body.email
    }, req.body.password);
    res.redirect('/signin')
  }catch(err){
    console.log(err)
    res.send(err);
  }
});
router.get('/signin', function(req, res, next) {
  const isUser = req.user
  if(isUser){
    res.redirect('/profile')
  } else {
    res.render('signin',{loginUser:req.user});
  }
});
router.post('/signin',passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect:'/signin'
}), function(req, res, next){})
router.get("/profile", isLoggedIn,async function (req, res, next) {
  try {
      const medias = await picture.find();
      res.render("profile", { medias: medias,loginUser:req.user});
  } catch (error) {
      res.send(error);
  }
});

router.post("/uploadFile", isLoggedIn,function (req, res, next) {
  upload(req, res, async function (err) {
      if (err) throw err;
      try {
          const media = new picture({
              username: req.body.username,
              avatar: req.file.filename,
          });
          await media.save();
          res.redirect("/show");
      } catch (error) {
          res.send(error);
      }
  });
});
router.get('/show', isLoggedIn,async function(req, res, next) {
  try{
    const media = await picture.find()
  res.render('show', {DATA: media,loginUser:req.user});

  }catch(err){
    res.send(err)
    console.log(error)
  }
});
router.get("/delete/:id",isLoggedIn, async function (req, res, next) {
  try {
      const media = await picture.findByIdAndDelete(req.params.id);
      fs.unlinkSync("./public/uploads/" + media.avatar);
      res.redirect("/profile");
  } catch (error) {
      res.send(error);
  }
});
router.get('/update/:id',  isLoggedIn,async function(req, res, next) {
  try{
    const media = await picture.findById(req.params.id)
    res.render('update', {update:media, loginUser:req.user});
  }catch(err){
    res.send(err)
  }
  });
  router.post('/update/:id', isLoggedIn, async function(req, res, next) {
    multer(req,res, async function(err){
if(err) throw err
try{
  const user = await picture.findByIdAndUpdate(req.params.id, {username: req.body.username, avatar: req.file.filename})
  res.redirect("/show")
}catch(err){
  res.send(err)
}
    })
    });
    router.get('/about', function(req, res, next) {
      res.render('about', {loginUser:req.user});
    });
    router.get('/contact', function(req, res, next) {
      res.render('contact', {loginUser:req.user});
    });
    router.get('/logout', isLoggedIn, function(req, res, next) {
      req.logOut(()=>{
        res.redirect('/signin');
      })
    
    });
    function isLoggedIn(req, res, next){
      if(req.isAuthenticated()){
        next()
      } else{
        res.redirect('/signin')
      }
    }
module.exports = router;
