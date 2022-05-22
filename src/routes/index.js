const router = require('express').Router();
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const mainController = require('../app/controllers/MainController');
const listingController = require('../app/controllers/ListingController');
const profileController = require("../app/controllers/ProfileController");

const authenticationController = require("../app/controllers/AuthenticationController");
const nftController = require('../app/controllers/NftController');

const authenticationHandlers = require("../app/handlers/AuthenticationHandlers");
const web3handlers = require("../app/handlers/Web3Handlers");

const apiRouter = require('./api');
const nftRouter = require('./nft');

router.use('/api', apiRouter);
router.use('/nft', nftRouter);

router.post('/testPost', web3handlers.web3Handler, mainController.testPost);

router.get(['/', '/index'], web3handlers.web3Handler, mainController.welcomePage);
router.get('/activity', mainController.activityPage);
router.get('/blog', mainController.blogPage);
router.get('/blog-2', mainController.blogPage2);
router.get('/blog-3', mainController.blogPage3);
router.get('/contact', mainController.contactPage);
router.get('/forgot-pass', mainController.forgotPassPage);
router.get('/item-details', listingController.itemDetailsPage);
router.get('/signin', authenticationHandlers.isNotAuth, mainController.signInPage);
router.get('/signup', authenticationHandlers.isNotAuth, mainController.signUpPage);
router.get('/wallet', authenticationHandlers.isAuth, mainController.walletPage);
router.get('/404', mainController.errorNotFoundPage);
router.post('/signup', authenticationHandlers.isNotAuth, authenticationController.register);
router.post('/signin', authenticationHandlers.isNotAuth, authenticationController.login);
router.get('/signout', authenticationHandlers.isAuth, authenticationController.signout);
router.get('/explore', listingController.listingPage);

router.get('/all-authors', profileController.allAuthorsPage);
router.get('/author', profileController.authorPage);
router.get('/auction', mainController.auctionPage);
router.post('/create-nft',upload.single('file'), nftController.create)

// router.get('/blog-single', mainController.blogSinglePage);
// router.get('/blog-single-2', mainController.blogSingle2Page);

module.exports = router;