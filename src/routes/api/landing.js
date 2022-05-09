var router = require('express').Router();
var mainController = require('../../app/controllers/MainController');

router.get('/', mainController.landingPage);

module.exports = router;