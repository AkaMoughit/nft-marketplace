'use strict'

const authenticationService = require('../services/AuthenticationService')

exports.register = function (req, res) {
    let errorMsg = res.locals.nameMsg || res.locals.phoneMsg || res.locals.birthdateMsg || res.locals.emailMsg
        || res.locals.passwordMsg
    if (errorMsg) {
        return res.status(400).render('signup',{
            info: errorMsg,
            sessionData: { isAuth: false, profile: {}}});
    }
    authenticationService.register(req.body)
        .then(info => {
            res.status(303).redirect('/signin');
        })
        .catch(err => {
            res.status(500).render('signup',{info: err, sessionData: { isAuth: false, profile: {}}});
        });
}

exports.login = function(req, res) {
    if (res.locals.emailMsg || res.locals.passwordMsg) {
        return res.status(400).render('signin', {info : res.locals.emailMsg || res.locals.passwordMsg, sessionData: { isAuth: false, profile: {}}});
    }
    authenticationService.login(req.body)
        .then(profile => {
            if (profile.UserId > 0) {
                req.session.isAuth = true;
                req.session.profile = profile;

                res.cookie("sessionData", { isAuth: req.session.isAuth, profile: req.session.profile }, { httpOnly: true });

                // redirect is disgusting
                res.status(303).redirect("/author?profileId=" + profile.profile_id);
            } else {
                req.session.isAuth = false;
                req.session.profile = {};

                res.cookie("sessionData", { isAuth: req.session.isAuth, profile: req.session.profile }, { httpOnly: true });
                res.status(401).render('signin', {info : "wrong email or password", sessionData: { isAuth: false, profile: {}}});
            }
        })
        .catch(
            err => {
                req.session.isAuth = false;
                req.session.profile = {};

                console.log(err);
                res.status(500).render('signin', {info : "An error has occurred", sessionData: { isAuth: false, profile: {}}});
            }
        )
}

exports.signInPage = function (req, res) {
    res.status(200).render('signin', {info : null, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile}});
}

exports.signUpPage = function (req, res) {
    res.status(200).render('signup', {info: null, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

exports.signout = function(req,res) {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.status(303).redirect("/signin");
    });
}


