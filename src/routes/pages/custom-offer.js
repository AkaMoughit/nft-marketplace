const mainController = require("../../app/controllers/MainController");

var router = require("express").Router();

router.get('/blog', mainController.blogPage);
router.get('/blog-2', mainController.blogPage2);
router.get('/blog-3', mainController.blogPage3);
router.get('/blog-single', mainController.blogSinglePage);
router.get('/blog-single-2', mainController.blogSingle2Page);

module.exports = router;