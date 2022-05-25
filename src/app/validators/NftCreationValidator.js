const { check, validationResult } = require('express-validator')

exports.schema = [
    check('name', 'NFT name must not be empty')
        .exists({checkFalsy: true}),
    check('description','Description undefined')
        .isLength({min : 10})
        .exists({checkFalsy: true}),
    check('listingType', 'Listing type not valid')
        .isIn(['NORMAL','AUCTION']),
    check('price', 'The price is not valid')
        .isFloat({gt : 0.0001})
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
            if (error.param === "description") {
                res.locals.descriptionMsg = error.msg;
            }
            if (error.param === "listingType") {
                res.locals.listingnMsg = error.msg;
            }
            if (error.param === "price") {
                res.locals.priceMsg = error.msg;
            }
        })
        next();
    }
}