'use strict'

const authenticationService = require('../services/AuthenticationService')
const profileService = require("../services/ProfileService");

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
            req.session.isAuth = true;
            req.session.profile = profile;

            // redirect is disgusting
            res.status(303).redirect("/author?profileId=" + profile.profile_id);
        }).catch(err => {
                req.session.isAuth = false;
                req.session.profile = {};

                switch(err.code) {
                    case -2:
                        const htmlResult = `Account not verified, <a class="resend-verification-button" href="#" data-email="${req.body.email}">Resend?</a>`
                        res.status(401).render('signin', {info: htmlResult, sessionData: {isAuth: false, profile: {}}});
                        break;
                    case -3:
                        req.session.isAuth = false;
                        req.session.profile = {};

                        res.cookie("sessionData", { isAuth: req.session.isAuth, profile: req.session.profile }, { httpOnly: true });
                        res.status(401).render('signin', {info : err.message, sessionData: { isAuth: false, profile: {}}});
                        break;
                    default:
                        req.session.isAuth = false;
                        req.session.profile = {};

                        res.status(500).render('signin', {info : err.message, sessionData: { isAuth: false, profile: {}}});
                }
            });
}

exports.signInPage = function (req, res) {
    res.status(200).render(
        'signin',
        {
            info : null, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile}
        }
    );
}

exports.signUpPage = function (req, res) {
    res.status(200).render('signup', {info: null, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

exports.signout = function(req,res) {
    req.session.destroy();
    res.status(303).redirect("/signin");
}

exports.emailVerification = function (req, res) {
    let verificationCode = req.query.verificationCode;
    if(!verificationCode) {
        res.status(400).send("Invalid verification code");
        return;
    }

    authenticationService.emailVerification(verificationCode)
        .then(userVerification => {
            res.status(200).send('Verification completed');
        }).catch(error => {
            res.status(401).send(error.reason);
    });
}

exports.resendVerification = function (req, res) {
    if(!req.query.email) {
        res.status(404).render('404', {sessionData: {isAuth: false, profile: {}}});
        return;
    }

    authenticationService.resendVerification(req.query.email)
        .then(result => {
            res.status(200).send(result);
        })
        .catch(e => {
            console.log(e);
            res.status(401).send(e);
        });
}

exports.resetPassword = function (req, res) {
    authenticationService.resetPassword(req.body.email)
        .then(result => {
            res.status(200).send(result);
        }).catch(e => {
            console.log(e);
            res.status(401).send(e);
        });
}
