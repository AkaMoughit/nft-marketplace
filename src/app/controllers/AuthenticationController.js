const authenticationService = require('../services/AuthenticationService')

exports.isAuth = function (req, res, next) {
    if (req.session.isAuth) {
        next();
    } else {
        res.redirect("/signin");
    }
}

exports.isNotAuth = function (req, res, next) {
    if (!req.session.isAuth) {
        next();
    } else {
        res.redirect("/");
    }
}

exports.register = function (req, res) {
    authenticationService.register(req.body)
        .then(info => {
            res.status(201).render('signup',{info: info});
        })
        .catch(err => {
            res.status(404).render('signup',{info: err});
        });

}

exports.login = function(req, res) {
    authenticationService.login(req.body)
        .then(profile => {
            console.log(profile);
            if (profile.UserId > 0) {
                console.log(req.session);
                req.session.isAuth = true;
                console.log(req.session.id);
                res.redirect("/author?profileId=" + profile.profile_id);
            } else {
                res.status(404).render('signin', {info : "wrong email or password"});
            }
        })
        .catch(
            err => {
                console.log(err);
                res.status(404).render('signin', {info : "An error has occurred"});
            }
        )
}

exports.signout = function(req,res) {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect("/signin");
    });
}


