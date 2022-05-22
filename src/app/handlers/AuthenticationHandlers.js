'use strict'

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