const { check, validationResult } = require('express-validator')

exports.schema = [
    check('email', 'The email should be a valid email address')
        .isEmail(),
    check('password', 'The password should be at least 8 characters long')
        .isLength({min : 8})
]

exports.validate = function (req, res, next) {
    const errors = validationResult(req).errors;
    if (errors.length === 0) {
        next();
    } else {
        errors.forEach(error => {
            if (error.param === "email") {
                res.locals.emailMsg = error.msg;
            }
            if (error.param === "password") {
                res.locals.passwordMsg = error.msg;
            }
        })
        next();
    }
}

