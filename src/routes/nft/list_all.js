var router = require('express').Router();
var nftController = require('../../app/controllers/ListingController');

router.get('/', nftController.listingPage);

module.exports = router;