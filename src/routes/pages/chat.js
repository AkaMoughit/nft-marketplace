const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");
const web3handlers = require("../../app/handlers/Web3Handlers");
const chatController = require("../../app/controllers/ChatController");

var router = require("express").Router();

router.get('/conversation', authenticationHandlers.isAuth, web3handlers.loadingHandler, chatController.conversationPage);

module.exports = router;