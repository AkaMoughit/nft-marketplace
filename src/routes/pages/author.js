const web3handlers = require("../../app/handlers/Web3Handlers");
const profileController = require("../../app/controllers/ProfileController");

var router = require("express").Router();

router.get('/all-authors', web3handlers.loadingHandler, profileController.allAuthorsPage);
router.get('/author', web3handlers.loadingHandler, profileController.authorPage);

module.exports = router;