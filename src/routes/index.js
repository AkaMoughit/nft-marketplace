var router = require('express').Router();
var mainController = require('../app/controllers/mainController');
var apiRouter = require('./api');

router.use('/api', apiRouter);

router.get('/', mainController.welcomePage);

module.exports = router;