const web3handlers = require("../../app/handlers/Web3Handlers");
const mainController = require("../../app/controllers/MainController");

var router = require("express").Router();

router.get('/404', web3handlers.loadingHandler, mainController.errorNotFoundPage);

module.exports = router;