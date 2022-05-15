const path = require('path');
const nftRepository = require('../repositories/NftRepository');

exports.welcomePage = function (req, res) {
    // userRepository.findByPk(1)
    //     .then(result => {
    //         console.log(result);
    //         res.status(200).render('index', { data: JSON.stringify(result) });
    //
    //     }).catch(error => {
    //         res.status(404).send("This user is not present in the database.");
    //     });

};

exports.welcomePage2 = function (req, res) {
    // userRepository.findByPk(1)
    //     .then(result => {
    //         console.log(result);
    //         res.status(200).render('index-2', { data: JSON.stringify(result) });
    //
    //     }).catch(error => {
    //     res.status(404).send("This user is not present in the database.");
    // });

};

exports.welcomePage3 = function (req, res) {
    let pageNumberElements = 8;
    nftRepository.findAllNftCardsOrderedByFavoriteCount(pageNumberElements, 0)
        .then( nftCards => {
            res.status(200).render('index-3', { nfts: nftCards.rows });

        }).catch(error => {
        res.status(404).render('404', {error: error});
    });

};

exports.explorePage = function (req, res) {
    res.status(200).render('explore', {});
}

exports.auctionPage = function (req, res) {
    res.status(200).render('auction', {});
}

exports.activityPage = function (req, res) {
    res.status(200).render('activity', {});
}

exports.allAuthorsPage = function (req, res) {
    res.status(200).render('all-authors', {});
}

exports.allAuthors2Page = function (req, res) {
    res.status(200).render('all-authors-2', {});
}

exports.auctionPage = function (req, res) {
    res.status(200).render('auction', {});
}

exports.blogPage = function (req, res) {
    res.status(200).render('blog', {});
}

exports.blogPage2 = function (req, res) {
    res.status(200).render('blog-2', {});
}

exports.blogPage3 = function (req, res) {
    res.status(200).render('blog-3', {});
}

exports.blogSinglePage = function (req, res) {
    res.status(200).render('blog-single', {});
}

exports.blogSingle2Page = function (req, res) {
    res.status(200).render('blog-single-2', {});
}

exports.comingSoonPage = function (req, res) {
    res.status(200).render('coming-soon', {});
}

exports.contactPage = function (req, res) {
    res.status(200).render('contact', {});
}

exports.forgotPassPage = function (req, res) {
    res.status(200).render('forgot-pass', {});
}

exports.signInPage = function (req, res) {
    res.status(200).render('signin', {});
}

exports.signUpPage = function (req, res) {
    res.status(200).render('signup', {});
}

exports.walletPage = function (req, res) {
    res.status(200).render('wallet', {});
}

exports.errorNotFoundPage = function (req, res) {
    res.status(200).render('404', {});
}