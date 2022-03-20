var router = require('express').Router();
var mainController = require('../../app/controllers/mainController');

router.get('/', mainController.landingPage);

module.exports = router;