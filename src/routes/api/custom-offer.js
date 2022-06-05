const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");
const customOfferController = require("../../app/controllers/CustomOfferController");

const multer  = require('multer')
const {nanoid} = require("nanoid");
const mime = require("mime-types");
const offerUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,  './src/client/public/assets/uploads/offers')
        },
        filename: (req, file, cb) => {
            let id = nanoid();
            let ext = mime.extension(file.mimetype);
            cb(null, `${id}.${ext}`);
        }
    })
});

var router = require('express').Router();

router.post('/createCustomOffer', authenticationHandlers.isAuth, offerUpload.single('file'), customOfferController.createCustomOffer);

module.exports = router;