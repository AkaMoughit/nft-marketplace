const router = require('express').Router();

const mainController = require('../app/controllers/MainController');
const listingController = require('../app/controllers/ListingController');
const profileController = require("../app/controllers/ProfileController");
const nftController = require('../app/controllers/NftController');

const apiRouter = require('./api');
const nftRouter = require('./nft');
const authenticationController = require("../app/controllers/AuthenticationController");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

router.use('/api', apiRouter);
router.use('/nft', nftRouter);

router.post('/testPost', mainController.testPost);

router.get(['/', '/index'], mainController.welcomePage);
router.get('/activity', mainController.activityPage);
router.get('/blog', mainController.blogPage);
router.get('/blog-2', mainController.blogPage2);
router.get('/blog-3', mainController.blogPage3);
router.get('/contact', mainController.contactPage);
router.get('/forgot-pass', mainController.forgotPassPage);
router.get('/item-details', listingController.itemDetailsPage);
router.get('/signin', authenticationController.isNotAuth, mainController.signInPage);
router.get('/signup', authenticationController.isNotAuth, mainController.signUpPage);
router.get('/wallet', mainController.walletPage);
router.get('/404', mainController.errorNotFoundPage);
router.post('/signup', authenticationController.isNotAuth, authenticationController.register);
router.post('/signin', authenticationController.isNotAuth, authenticationController.login);
router.get('/signout', authenticationController.isAuth, authenticationController.signout);
router.get('/explore', listingController.listingPage);

router.get('/all-authors', profileController.allAuthorsPage);
router.get('/author', profileController.authorPage);
router.get('/auction', mainController.auctionPage);
router.post('/create-nft',upload.single('file'), nftController.create)

// router.get('/blog-single', mainController.blogSinglePage);
// router.get('/blog-single-2', mainController.blogSingle2Page);

module.exports = router;