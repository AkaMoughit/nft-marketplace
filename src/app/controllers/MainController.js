'use strict'

const nftRepository = require('../repositories/NftRepository');
const listingRepository = require('../repositories/ListingRepository');
const profileService = require('../services/ProfileService');
const customOfferService = require('../services/CustomOfferService');
exports.welcomePage = async function (req, res) {

    // You can access the contract by simply grabbing it from the app.locals variable
    // const items = await req.app.locals.marketplaceContract.itemCount();
    // console.log(items);

    let pageNumberElements = 8;
    try {
        let activeListings = await listingRepository.findAllActiveListings(pageNumberElements, 0);
        let sellers = await profileService.findAllAuthors(pageNumberElements, 0);
        let customOffers = await customOfferService.findAllCustomOffers(3, 0);

        if(!activeListings || !sellers || !customOffers) {
            throw new Error("Could not fetch data from database");
        }

        res.status(200).render('index', {
            customOffers: customOffers.rows,
            sellers: sellers.rows,
            nfts: activeListings.rows,
            sessionData: {isAuth: req.session.isAuth, profile: req.session.profile}
        });
    } catch (error) {
        res.status(404).render('404', {
            error: error,
            sessionData: {isAuth: req.session.isAuth, profile: req.session.profile}
        });
    }
};

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

    // await nftRepository.model.build({
    //     id: 99993,
    //     creation_date: faker.date.past(),
    //     contract_adress: faker.address.city(0),
    //     token_id: faker.datatype.uuid(),
    //     description: faker.lorem.text(),
    //     name: faker.name.findName(),
    //     //blockchain_type: 'ETHEREUM',
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     CreatorId: 54
    // }).save();
    //
    // await listingRepository.model.build({
    //     id: 99994,
    //     price: 69,
    //     type: 'NORMAL',
    //     sale_end_date: faker.date.past(),
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //     NftId: 99993,
    //     SellerId: 54
    // }).save();

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
