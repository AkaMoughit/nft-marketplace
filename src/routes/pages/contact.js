const mainController = require("../../app/controllers/MainController");

var router = require("express").Router();

router.get('/contact', mainController.contactPage);

module.exports = router;