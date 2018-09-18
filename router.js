var express = require('express')
var User = require('./models/user')
var Topic = require('./models/topic')
var Comment = require('./models/comment')
var md5 = require('blueimp-md5')

var router = express.Router()

var comments = []

router.get('/', function (req, res, next){
    Topic.find(function (err, topics) {
        if (err) {
            return next(err)
        }
        res.render('index.html', {
            user: req.session.user,
            topics: topics
        }) 
    })
})

router.get('/login', function (req, res, next){
    res.render('login.html')
})

router.post('/login', function(req, res, next){
    var body = req.body
  
    User.findOne({
        email: body.email,
        password: md5(md5(body.password))
    }, function (err, user) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(200).json({
                err_code: 1,
                message: 'Email or password is invalid'
            })
        }

        req.session.user = user
        res.status(200).json({
            err_code: 0,
            message: 'ok'
        })
    })
})

router.get('/register', function(req, res, next){
    res.render('register.html')
})

router.post('/register', function(req, res, next){
    var body = req.body
    User.findOne({
        $or: [
            {
                email: body.email
            },
            {
                nickname: body.nickname
            }
        ]
    }, function (err, data) {
        if (err) {
            return next(err)
        }
        if (data) {
            return res.status(200).json({
                err_code: 1,
                message: 'email or nickname exists'
            })
        }

        body.password = md5(md5(body.password))

        new User(body).save(function (err, user) {
            if (err) {
                return next(err)
            }

            req.session.user = user

            res.status(200).json({
                err_code: 0,
                message: 'ok'
            })
        }) 
    })
})

router.get('/topics/new', function(req, res, next){
    res.render('topics/new.html', {
        user: req.session.user
    })
})

router.post('/topics/new', function(req, res, next){
    
    var body = req.body
    body.author = req.session.user.nickname
    
    new Topic(body).save(function(err) {
        if (err) {
            return next(err)
        }
        res.status(200).json({
            err_code: 0,
            message: 'submit topic success'
        })
    })
})

router.get('/topics/show', function(req, res, next){
    var id = req.query.id.replace(/"/g, '')
    Topic.findById(id, function(err, topic) {
        if (err) {
            return next(err)
        }
        Comment.find({
            topicID: topic._id
        }, function (err, comments) {
            if (err) {
                return next(err)
            }
            this.comments = comments
            res.render('topics/show.html', {
                user: req.session.user,
                topic: topic,
                comments: comments
            })
        })
    })
})

router.post('/topics/show', function(req, res, next) {
    var body = req.body
    body.topicID = body.topicID.replace(/"/g, '')
    new Comment(body).save(function(err) {
        if (err) {
            return next(err)
        }
        Comment.find({
            topicID: body.topicID
        }, function(err, topics) {
            if (err) {
                return next(err)
            }
            var bodynew = new Object()
            bodynew.commentcnt = topics.length
            Topic.findByIdAndUpdate(body.topicID, bodynew, function(err) {
                if (err) {
                    return next(err)
                }
                res.status(200).json({
                    err_code: 0,
                    message: 'reply success'
                })
            })
        })
        
    })
})

router.get('/component/getComment', function(req, res, next){
    res.status(200).json({
        comments: JSON.stringify(this.comments),
        nickname: req.session.user.nickname
    })
})

router.get('/settings/profile', function(req, res, next){
    res.render('settings/profile.html', {
        user: req.session.user
    })
})

router.post('/settings/profile', function(req, res, next){
    var body = req.body
    body.last_modified_time = Date.now()
    User.findByIdAndUpdate(body.id, body, function(err, user) {
        if (err) {
            return next(err)
        }
        User.findById(body.id, function(err, usernew) {
            if (err) {
                return next(err)
            }
            req.session.user = usernew
            res.status(200).json({
                err_code: 0,
                message: 'Set profile success'
            })
        })
    })
})


router.get('/settings/admin', function(req, res, next){
    res.render('settings/admin.html', {
        user: req.session.user
    })
})

router.post('/settings/admin', function(req, res, next){
    var body = req.body
    User.findById(body.id, function(err, user) {
        if (err) {
            return next(err)
        }
        if (user.password != md5(md5(body.passwordOld))) {
            return res.status(200).json({
                err_code: 1,
                message: 'Current password does not exist'
            })
        }
        if (body.passwordNew != body.passwordNew2) {
            return res.status(200).json({
                err_code: 2,
                message: 'New password does not match'
            })
        }
        var bodynew = new Object()
        bodynew.password = md5(md5(body.passwordNew))
        bodynew.last_modified_time = Date.now()
        User.findByIdAndUpdate(body.id, bodynew, function(err) {
            if (err) {
                return next(err)
            }
            User.findById(body.id, function(err, usernew) {
                if (err) {
                    return next(err)
                }
                req.session.user = usernew
                res.status(200).json({
                    err_code: 0,
                    message: 'Password update success'
                })
            })
        })
    })
})

router.get('/settings/admin/delete', function(req, res, next){
    var id = req.query.id.replace(/"/g, '')
    User.findByIdAndRemove(id, function(err, user) {
        if (err) {
            return next(err)
        }
        req.session.user = null
        res.redirect('/')
    })
})

router.get('/logout', function(req, res, next) {
    req.session.user = null
    res.redirect('/login')
})

module.exports = router