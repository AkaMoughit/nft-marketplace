const web3handlers = require("../../app/handlers/Web3Handlers");
const mainController = require("../../app/controllers/MainController");

var router = require("express").Router();

router.get('/activity', web3handlers.loadingHandler, mainController.activityPage);

module.exports = router;