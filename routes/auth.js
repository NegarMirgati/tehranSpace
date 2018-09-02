var express = require('express')
var router = express.Router()
var User = require('../models/user')

router.get('/signup', (req, res) => {
    res.render('signup.ejs')
})

router.post('/signup', function (req, res, next) {
    if (req.body.password !== req.body.passwordConf) {
        var errorMessage = 'Passwords do not match.'
        var err = new Error(errorMessage)
        err.status = 400
        res.send(errorMessage)
        next(err)
    }

    if (req.body.email && req.body.password && req.body.passwordConf) {
        var userData = {
            email: req.body.email,
            password: req.body.password
        }

        User.create(userData)
            .then(user => {
                req.session.userId = user._id
                res.redirect('/profile')
            })
            .catch(err => next(err))

    } else {
        var err = new Error('All fields required.')
        err.status = 400
        return next(err)
    }
})

router.post('/login', (req, res) => {
    User.authenticate(req.body.logemail, req.body.logpassword)
        .then(user => {
            req.session.userId = user._id
            res.redirect('/profile')
        })
        .catch(() => {
            const err = new Error('Wrong email or password.')
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

module.exports = router
