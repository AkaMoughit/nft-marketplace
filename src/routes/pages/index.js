var router = require("express").Router();

router.use('/', require('./listing'));
router.use('/', require('./chat'));
router.use('/', require('./wallet'));
router.use('/', require('./author'));
router.use('/', require('./authentication'));
router.use('/', require('./custom-offer'));
router.use('/', require('./errors'));
router.use('/', require('./landing'));
router.use('/', require('./activities'));
router.use('/', require('./auction'));
router.use('/', require('./contact'));

module.exports = router;
