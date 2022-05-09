var router = require('express').Router();
var mainController = require('../app/controllers/MainController');
var apiRouter = require('./api');
var nftRouter = require('./nft');

router.use('/api', apiRouter);
router.use('/nft', nftRouter);

router.get('/', mainController.welcomePage);

module.exports = router;