const path = require('path');
const nftRepository = require('../repositories/NftRepository');
const listingRepository = require('../repositories/ListingRepository');
const {faker} = require("@faker-js/faker");

exports.welcomePage = function (req, res) {
    let pageNumberElements = 8;
    listingRepository.findAllActiveListings(pageNumberElements, 0)
        .then( data => {
            res.status(200).render('index-3', { nfts: data.rows });
        }).catch(error => {
        res.status(404).render('404', {error: error});
    });

};

exports.testPost = async function (req, res) {
    console.log("Post called");
    // listingRepository.findListingByTokenId("176bf0d1-00fc-4e72-bbd4-af7152041f63")
    //     .then(data => {
    //         res.status(200).send(data);
    //     }).catch(err => {
    //         console.log(err);
    //         res.status(404).send(err);
    // });

    await nftRepository.model.build({
        id: 99997,
        creation_date: faker.date.past(),
        contract_adress: faker.address.city(0),
        token_id: faker.datatype.uuid(),
        description: faker.lorem.text(),
        name: faker.name.findName(),
        //blockchain_type: 'ETHEREUM',
        createdAt: new Date(),
        updatedAt: new Date(),
        CreatorId: 1
    }).save();

    await listingRepository.model.build({
        id: 99999,
        price: 69,
        type: 'NORMAL',
        sale_end_date: faker.date.past(),
        createdAt: new Date(),
        updatedAt: new Date(),
        NftId: 99997,
        SellerId: 1
    }).save();

    // let result = await listingRepository.model.update(
    //     {
    //         BuyerId: 1,
    //         transaction_date: new Date()
    //     },
    //     {
    //         where: {
    //             NftId: 99997
    //         },
    //         individualHooks: true
    //     });

    res.status(200).send();
}

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
    res.status(200).render('signin', {info : null});
}

exports.signUpPage = function (req, res) {
    console.log(req.session);
    res.status(200).render('signup', {info: null});
}

exports.walletPage = function (req, res) {
    res.status(200).render('wallet', {});
}

exports.errorNotFoundPage = function (req, res) {
    res.status(200).render('404', {});
}