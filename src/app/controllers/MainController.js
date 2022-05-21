'use strict'

const path = require('path');
const nftRepository = require('../repositories/NftRepository');
const listingRepository = require('../repositories/ListingRepository');
const {faker} = require("@faker-js/faker");
const {request} = require("express");

exports.welcomePage = function (req, res) {
    let pageNumberElements = 8;
    listingRepository.findAllActiveListings(pageNumberElements, 0)
        .then( data => {
            res.status(200).render('index', { nfts: data.rows, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile } });
        }).catch(error => {
        res.status(404).render('404', {error: error, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
    });
};

exports.signInPage = function (req, res) {
    res.status(200).render('signin', {info : null, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile}});
}

exports.signUpPage = function (req, res) {
    res.status(200).render('signup', {info: null, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

exports.errorNotFoundPage = function (req, res) {
    res.status(200).render('404', {sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

exports.comingSoonPage = function (req, res) {
    res.status(200).render('coming-soon', {sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

exports.contactPage = function (req, res) {
    res.status(200).render('contact', {sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

exports.forgotPassPage = function (req, res) {
    res.status(200).render('forgot-pass', {sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

exports.auctionPage = function (req, res) {
    res.status(200).render('coming-soon', {sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

exports.activityPage = function (req, res) {
    res.status(200).render('activity', {sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

exports.walletPage = function (req, res) {
    res.status(200).render('wallet', {sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
}

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
        id: 99993,
        creation_date: faker.date.past(),
        contract_adress: faker.address.city(0),
        token_id: faker.datatype.uuid(),
        description: faker.lorem.text(),
        name: faker.name.findName(),
        //blockchain_type: 'ETHEREUM',
        createdAt: new Date(),
        updatedAt: new Date(),
        CreatorId: 54
    }).save();

    await listingRepository.model.build({
        id: 99994,
        price: 69,
        type: 'NORMAL',
        sale_end_date: faker.date.past(),
        createdAt: new Date(),
        updatedAt: new Date(),
        NftId: 99993,
        SellerId: 54
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