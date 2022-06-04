const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");
const web3handlers = require("../../app/handlers/Web3Handlers");
const authenticationController = require("../../app/controllers/AuthenticationController");
const mainController = require("../../app/controllers/MainController");

var router = require('express').Router();

router.get('/signin', authenticationHandlers.isNotAuth, web3handlers.loadingHandler, authenticationController.signInPage);
router.get('/signup', authenticationHandlers.isNotAuth, web3handlers.loadingHandler, authenticationController.signUpPage);
router.get('/forgot-pass', mainController.forgotPassPage);

module.exports = router;