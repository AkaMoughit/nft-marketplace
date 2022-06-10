const web3handlers = require("../../app/handlers/Web3Handlers");
const nftCreationValidator = require("../../app/validators/NftCreationValidator");
const nftController = require("../../app/controllers/NftController");
const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");

const multer = require("multer");
const {nanoid} = require("nanoid");
const mime = require("mime-types");
const storage = multer.memoryStorage({
    destination: (req, file, cb) => {
        cb(null,  '')
    },
    filename: (req, file, cb) => {
        let id = nanoid();
        let ext = mime.extension(file.mimetype);
        cb(null, `${id}.${ext}`);
    }
});
const upload = multer({storage: storage});

var router = require('express').Router();

router.post('/create-nft', web3handlers.loadingHandler, upload.single('file'),
    nftCreationValidator.schema,
    nftCreationValidator.validate, nftController.create);
router.post('/uploadFile', authenticationHandlers.isAuth, web3handlers.loadingHandler, upload.single('file'), nftController.uploadFile);
router.post('/uploadData', authenticationHandlers.isAuth, web3handlers.loadingHandler, nftController.uploadData);
router.post('/toggle-nft-favorite', authenticationHandlers.isAuth, web3handlers.loadingHandler, nftController.toggleFavorite)

module.exports = router;