const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");
const web3handlers = require("../../app/handlers/Web3Handlers");
const CommentController = require("../../app/controllers/CommentController");

var router = require("express").Router();

router.post('/create-comment', authenticationHandlers.isAuth, web3handlers.loadingHandler, CommentController.postComment);

module.exports = router;