const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");
const customOfferController = require("../../app/controllers/CustomOfferController");

const multer  = require('multer')
const offerUpload = multer({ dest: './src/client/public/assets/uploads/offers' });

var router = require('express').Router();

router.post('/createCustomOffer', authenticationHandlers.isAuth, offerUpload.single('file'), customOfferController.createCustomOffer);

module.exports = router;