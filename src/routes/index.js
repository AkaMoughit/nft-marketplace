var router = require('express').Router();
var mainController = require('../app/controllers/mainController');

router.use('/api', require('./api'));

router.get('/', mainController.welcomePage);

module.exports = router;