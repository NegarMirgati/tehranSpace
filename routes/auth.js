var express = require('express')
var router = express.Router()
var User = require('../models/user')

router.get('/', (req, res) => {
    res.render('index.ejs')
})

router.get('/signup', (req, res) => {
    res.render('signup.ejs')
})

router.get('/login', (req, res) => {
    res.render('login.ejs')
})

router.post('/signup', function (req, res, next) {
    console.log('signup')
    if (req.body.password !== req.body.passwordConf) {
        var errorMessage = 'Passwords do not match.'
        var err = new Error(errorMessage)
        err.status = 400
        res.send(errorMessage)
        next(err)
    }

    if (req.body.email && req.body.password && req.body.passwordConf && req.body.username && req.body.bday) {
        var userData = {
            email: req.body.email,
            password: req.body.password,
            username: req.body.username,
            university : req.body.university,
            bday: req.body.bday
        }

        User.create(userData)
            .then(user => {
                req.session.userId = user._id
                req.session.user = user
                res.redirect('profile')
            })
            .catch(err => next(err))

    } else {
        var err = new Error('All fields required.')
        err.status = 400
        return next(err)
    }
})

router.post('/login', function(req, res, next){
    console.log('here')
    User.authenticate(req.body.username, req.body.password)
        .then(user => {
            req.session.userId = user._id
            // req.session.user = user
            res.redirect('/profile')
        })
        .catch(() => {
            const err = new Error('Wrong email or password.')
            console.log('wrong')
            err.status = 401
            return next(err)
        })
})

// GET for logout logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err)
            } else {
                return res.redirect('/')
            }
        })
    }
})

router.get('/profile', (req, res) => {
    console.log('cccc', req.session.user)
    if (req.session && req.session.user) { 
        User.findOne({ email: req.session.user.email }, function (err, user) {
          if (!user) {
            req.session.reset();
            res.redirect('login');
        } 
    else {
            var userData = {
                email : req.session.user.email,
                username : req.session.user.username,
                bday : req.session.user.bday.split('T')[0],
                university : req.session.user.university
            }
            res.render('profile.ejs', {
                userdata : userData}
            );
        }
        });
      } else {
        res.redirect('login');
      }
})

module.exports = router
