var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = require('../models/users');
var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
var jwt = require('jsonwebtoken');

passport.use(new LocalStrategy(
    function(username, password, done) {
        User.findOne({username: username}, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {alert: 'Incorrect username.'});
            }
            if (user.password != password) {
                return done(null, false, {alert: 'Incorrect password.'});
            }
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
         done(err, user);
    });
});

function isAuthenticated(req,res,next){
    if(req.isAuthenticated())return next();
     res.send(401);
}

router.post('/login', passport.authenticate('local'),function(req, res){
    var token = jwt.sign(req.user, 'superSecret', {
        expiresInMinutes: 1440 // expires in 24 hours
    });
    res.json({
        user: {
            id: req.user._id,
            username: req.user.username
        },
        token: token
    });
});

router.get('/currentuser',isAuthenticated,function(req,res){
    res.json(req.user);
});

router.post('/signup',function(req,res){

    var u =  new User();
    u.username = req.body.username;
    u.password = req.body.password;

    u.save(function(err){
        if (err) {
            res.json({'alert':'Registration error'});
        }else{
            res.json({'alert':'Registration success'});
        }
    });
});

router.get('/logout', function(req, res){
    console.log('logout');
    req.logout();
    res.sendStatus(200);
 });

module.exports = router;