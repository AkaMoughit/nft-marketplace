var router = require('express').Router();
var nftController = require('../../app/controllers/NftController');

router.get('/', nftController.nftsPage);

module.exports = router;