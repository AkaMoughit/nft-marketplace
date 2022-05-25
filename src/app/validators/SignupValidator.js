const { check, validationResult } = require('express-validator')

exports.schema = [
    check('name', 'The name passed is not valid')
        .isLength({min : 3})
        .isAlpha('en-US', {ignore: ' '}),
    check('phone_number', 'The phone number should be valid, i.e ten numbers')
        .isLength({min: 10, max: 10})
        .isNumeric(),
    check('birthdate', 'Birthdate is not valid')
        .trim()
        .isDate({}),
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
            if (error.param === "name") {
                res.locals.nameMsg = error.msg;
            }
            if (error.param === "phone_number") {
                res.locals.phoneMsg = error.msg;
            }
            if (error.param === "birthdate") {
                res.locals.birthdateMsg = error.msg;
            }
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