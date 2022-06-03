const web3handlers = require("../../app/handlers/Web3Handlers");
const mainController = require("../../app/controllers/MainController");

var router = require("express").Router();

router.get('/auction', web3handlers.loadingHandler, mainController.auctionPage);

module.exports = router;