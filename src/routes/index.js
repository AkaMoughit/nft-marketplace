const router = require('express').Router();

const mainController = require('../app/controllers/MainController');
const apiRouter = require('./api');
const pageRouter = require('./pages');

router.use('/', apiRouter);
router.use('/', pageRouter);

router.post('/testPost', mainController.testPost);

module.exports = router;