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

router.post('/testPost', web3handlers.loadingHandler, mainController.testPost);

router.post('/uploadFile', upload.single('file'), mainController.uploadFile);
router.post('/uploadData', mainController.uploadData);

router.get(['/', '/index'], web3handlers.loadingHandler, web3handlers.loadingHandler, mainController.welcomePage);
router.get('/activity', web3handlers.loadingHandler, mainController.activityPage);
router.get('/blog', web3handlers.loadingHandler, mainController.blogPage);
router.get('/blog-2', web3handlers.loadingHandler, mainController.blogPage2);
router.get('/blog-3', web3handlers.loadingHandler, mainController.blogPage3);
router.get('/contact', web3handlers.loadingHandler, mainController.contactPage);
router.get('/forgot-pass', web3handlers.loadingHandler, mainController.forgotPassPage);
router.get('/item-details', web3handlers.loadingHandler, listingController.itemDetailsPage);
router.get('/wallet', web3handlers.loadingHandler, authenticationHandlers.isAuth, mainController.walletPage);
router.get('/404', web3handlers.loadingHandler, mainController.errorNotFoundPage);
router.get('/signout', web3handlers.loadingHandler, authenticationHandlers.isAuth, authenticationController.signout);
router.get('/explore', web3handlers.loadingHandler, listingController.listingPage);

router.get('/all-authors', web3handlers.loadingHandler, profileController.allAuthorsPage);
router.get('/author', web3handlers.loadingHandler, profileController.authorPage);
router.get('/auction', web3handlers.loadingHandler, mainController.auctionPage);
router.get('/signin', web3handlers.loadingHandler, authenticationHandlers.isNotAuth, mainController.signInPage);
router.get('/signup', web3handlers.loadingHandler, authenticationHandlers.isNotAuth, mainController.signUpPage);
router.get('/chat', web3handlers.loadingHandler, authenticationHandlers.isAuth, chatController.getConversation);
router.get('/conversation', web3handlers.loadingHandler, authenticationHandlers.isAuth, chatController.conversationPage);
router.post('/signup', signupValidator.schema,
    signupValidator.validate, authenticationHandlers.isNotAuth, authenticationController.register);
router.post('/signin', signinValidator.schema,
            signinValidator.validate, authenticationHandlers.isNotAuth, authenticationController.login);

router.post('/create-nft',upload.single('file'),
    nftCreationValidator.schema,
    nftCreationValidator.validate, nftController.create);


module.exports = router;