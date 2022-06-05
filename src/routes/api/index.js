var router = require("express").Router();

router.use('/', require('./landing'));
router.use('/', require('./custom-offer'));
router.use('/', require('./profile'));
router.use('/', require('./nft'));
router.use('/', require('./chat'));
router.use('/', require('./authentication'));
router.use('/', require('./comment'));

module.exports = router;