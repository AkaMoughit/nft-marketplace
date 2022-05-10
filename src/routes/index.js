const router = require('express').Router();
const mainController = require('../app/controllers/MainController');
const nftController = require('../app/controllers/NftController');
const apiRouter = require('./api');
const nftRouter = require('./nft');

router.use('/api', apiRouter);
router.use('/nft', nftRouter);

router.get(['/', '/index'], mainController.welcomePage3);
router.get('/index-2', mainController.welcomePage2);
router.get('/index-3', mainController.welcomePage);
router.get('/explore', nftController.nftsPage);
router.get('/auction', mainController.auctionPage);
router.get('/activity', mainController.activityPage);
router.get('/all-authors', mainController.allAuthorsPage);
router.get('/all-authors-2', mainController.allAuthors2Page);
router.get('/author', mainController.authorPage);
router.get('/blog', mainController.blogPage);
router.get('/blog-2', mainController.blogPage2);
router.get('/blog-3', mainController.blogPage3);
router.get('/blog-single', mainController.blogSinglePage);
router.get('/blog-single-2', mainController.blogSingle2Page);
router.get('/coming-soon', mainController.comingSoonPage);
router.get('/contact', mainController.contactPage);
router.get('/forgot-pass', mainController.forgotPassPage);
router.get('/item-details', mainController.itemDetailsPage);
router.get('/signin', mainController.signInPage);
router.get('/signup', mainController.signUpPage);
router.get('/wallet', mainController.walletPage);
router.get('/404', mainController.errorNotFoundPage);


module.exports = router;