var router = require("express").Router();

router.use('/', require('./list_all'));

module.exports = router;