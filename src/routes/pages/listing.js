var nftController = require('../../app/controllers/ListingController');
const web3handlers = require("../../app/handlers/Web3Handlers");
const listingController = require("../../app/controllers/ListingController");

var router = require('express').Router();

router.get('/explore', web3handlers.loadingHandler, listingController.listingPage);
router.get('/item-details', web3handlers.loadingHandler, listingController.itemDetailsPage);

module.exports = router;