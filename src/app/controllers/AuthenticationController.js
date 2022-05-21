'use strict'

const authenticationService = require('../services/AuthenticationService')

exports.isAuth = function (req, res, next) {
    if (req.session.isAuth) {
        next();
    } else {
        res.status(303).redirect("/signin");
    }
}

exports.isNotAuth = function (req, res, next) {
    if (!req.session.isAuth) {
        next();
    } else {
        res.status(303).redirect("/");
    }
}

exports.register = function (req, res) {
    authenticationService.register(req.body)
        .then(info => {
            res.status(303).redirect('/signin');
        })
        .catch(err => {
            res.status(404).render('signup',{info: err, sessionData: { isAuth: false, profile: {}}});
        });

}

exports.login = function(req, res) {
    authenticationService.login(req.body)
        .then(profile => {
            if (profile.UserId > 0) {
                req.session.isAuth = true;
                req.session.profile = profile;

                res.cookie("sessionData", { isAuth: req.session.isAuth, profile: req.session.profile }, { httpOnly: true });
                req.session.profileId = profile.id

                // redirect is disgusting
                res.status(303).redirect("/author?profileId=" + profile.profile_id);
            } else {
                req.session.isAuth = false;
                req.session.profile = {};

                res.cookie("sessionData", { isAuth: req.session.isAuth, profile: req.session.profile }, { httpOnly: true });
                res.status(404).render('signin', {info : "wrong email or password", sessionData: { isAuth: false, profile: {}}});
            }
        })
        .catch(
            err => {
                req.session.isAuth = false;
                req.session.profile = {};

                console.log(err);
                res.status(404).render('signin', {info : "An error has occurred", sessionData: { isAuth: false, profile: {}}});
            }
        )
}

exports.signout = function(req,res) {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.status(303).redirect("/signin");
    });
}


