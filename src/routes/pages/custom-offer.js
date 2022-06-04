const customOfferController = require("../../app/controllers/CustomOfferController");

var router = require("express").Router();

router.get('/offers', customOfferController.offersPage);
router.get('/offer-single', customOfferController.offerDetailsPage);

module.exports = router;