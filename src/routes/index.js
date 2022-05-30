const router = require('express').Router();
const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});

const mainController = require('../app/controllers/MainController');
const listingController = require('../app/controllers/ListingController');
const profileController = require("../app/controllers/ProfileController");
const authenticationController = require("../app/controllers/AuthenticationController");
const nftController = require('../app/controllers/NftController');
const chatController = require('../app/controllers/ChatController');

const authenticationHandlers = require("../app/handlers/AuthenticationHandlers");
const web3handlers = require("../app/handlers/Web3Handlers");

const signinValidator = require('../app/validators/SigninValidator');
const signupValidator = require('../app/validators/SignupValidator');
const nftCreationValidator = require('../app/validators/NftCreationValidator');

const apiRouter = require('./api');
const nftRouter = require('./nft');

router.use('/api', apiRouter);
router.use('/nft', nftRouter);

// router.get('/*', web3handlers.loadingHandler);
// router.post('/*', web3handlers.loadingHandler);
router.post('/testPost', mainController.testPost);

router.post('/uploadFile', authenticationHandlers.isAuth, web3handlers.loadingHandler, upload.single('file'), nftController.uploadFile);
router.post('/uploadData', authenticationHandlers.isAuth, web3handlers.loadingHandler, nftController.uploadData);

router.get(['/', '/index'], web3handlers.loadingHandler, mainController.welcomePage);
router.get('/activity', web3handlers.loadingHandler, mainController.activityPage);
router.get('/blog', mainController.blogPage);
router.get('/blog-2', mainController.blogPage2);
router.get('/blog-3', mainController.blogPage3);
router.get('/contact', mainController.contactPage);
router.get('/forgot-pass', mainController.forgotPassPage);
router.get('/item-details', web3handlers.loadingHandler, listingController.itemDetailsPage);
router.get('/wallet', authenticationHandlers.isAuth, web3handlers.loadingHandler, mainController.walletPage);
router.get('/404', web3handlers.loadingHandler, mainController.errorNotFoundPage);
router.get('/signout', authenticationHandlers.isAuth, authenticationController.signout);
router.get('/explore', web3handlers.loadingHandler, listingController.listingPage);

router.get('/all-authors', web3handlers.loadingHandler, profileController.allAuthorsPage);
router.get('/author', web3handlers.loadingHandler, profileController.authorPage);
router.get('/auction', web3handlers.loadingHandler, mainController.auctionPage);
router.get('/signin', authenticationHandlers.isNotAuth, web3handlers.loadingHandler, authenticationController.signInPage);
router.get('/signup', authenticationHandlers.isNotAuth, web3handlers.loadingHandler, authenticationController.signUpPage);
router.post('/signup', authenticationHandlers.isNotAuth, web3handlers.loadingHandler, signupValidator.schema,
    signupValidator.validate, authenticationController.register);
router.post('/signin', authenticationHandlers.isNotAuth, web3handlers.loadingHandler, signinValidator.schema,
            signinValidator.validate, authenticationController.login);

router.get('/chat', authenticationHandlers.isAuth, web3handlers.loadingHandler, chatController.getConversation);
router.get('/conversation', authenticationHandlers.isAuth, web3handlers.loadingHandler, chatController.conversationPage);

router.post('/create-nft', web3handlers.loadingHandler, upload.single('file'),
    nftCreationValidator.schema,
    nftCreationValidator.validate, nftController.create);


module.exports = router;