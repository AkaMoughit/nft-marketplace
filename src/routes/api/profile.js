const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");
const web3handlers = require("../../app/handlers/Web3Handlers");
const profileController = require("../../app/controllers/ProfileController");
const multer = require("multer");
const {nanoid} = require("nanoid");
const mime = require("mime-types");

var uploading = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null,  './src/client/public/assets/uploads')
        },
        filename: (req, file, cb) => {
            let id = nanoid();
            let ext = mime.extension(file.mimetype);
            cb(null, `${id}.${ext}`);
        }
    })
});

var router = require("express").Router();

router.post('/updateAccountAddress', authenticationHandlers.isAuth, web3handlers.loadingHandler, profileController.updateAccount);
router.put('/edit-profile-pic', authenticationHandlers.isAuth, web3handlers.loadingHandler,
    uploading.single('profilePic'), profileController.editProfilePic)
router.put('/edit-banner-pic', authenticationHandlers.isAuth, web3handlers.loadingHandler,
    uploading.single('bannerPic'), profileController.editBannerPic)
router.post('/edit-profile', authenticationHandlers.isAuth, web3handlers.loadingHandler, profileController.editProfile)

module.exports = router;