const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");
const web3handlers = require("../../app/handlers/Web3Handlers");
const signupValidator = require("../../app/validators/SignupValidator");
const authenticationController = require("../../app/controllers/AuthenticationController");
const signinValidator = require("../../app/validators/SigninValidator");

var router = require("express").Router();

router.post('/signup', authenticationHandlers.isNotAuth, web3handlers.loadingHandler, signupValidator.schema,
    signupValidator.validate, authenticationController.register);
router.post('/signin', authenticationHandlers.isNotAuth, web3handlers.loadingHandler, signinValidator.schema,
    signinValidator.validate, authenticationController.login);
router.get('/signout', authenticationHandlers.isAuth, authenticationController.signout);
router.get('/verifyAccount', authenticationHandlers.isNotAuth, authenticationController.emailVerification);
router.get('/resendVerification', authenticationHandlers.isNotAuth, authenticationController.resendVerification);
router.post('/resetPassword', authenticationHandlers.isNotAuth, authenticationController.resetPassword);

module.exports = router;