const authenticationHandlers = require("../../app/handlers/AuthenticationHandlers");
const web3handlers = require("../../app/handlers/Web3Handlers");
const profileController = require("../../app/controllers/ProfileController");
const multer = require("multer");

var uploading = multer({dest: './src/client/public/assets/uploads'});

var router = require("express").Router();

router.post('/updateAccountAddress', authenticationHandlers.isAuth, web3handlers.loadingHandler, profileController.updateAccount);
router.put('/edit-profile-pic', authenticationHandlers.isAuth, web3handlers.loadingHandler,
    uploading.single('profilePic'), profileController.editProfilePic)
router.put('/edit-banner-pic', authenticationHandlers.isAuth, web3handlers.loadingHandler,
    uploading.single('bannerPic'), profileController.editBannerPic)
router.post('/edit-profile', authenticationHandlers.isAuth, web3handlers.loadingHandler, profileController.editProfile)

module.exports = router;