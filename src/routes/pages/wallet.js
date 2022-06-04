const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");
const web3handlers = require("../../app/handlers/Web3Handlers");
const mainController = require("../../app/controllers/MainController");

var router = require("express").Router();

router.get('/wallet', authenticationHandlers.isAuth, web3handlers.loadingHandler, mainController.walletPage);

module.exports = router;