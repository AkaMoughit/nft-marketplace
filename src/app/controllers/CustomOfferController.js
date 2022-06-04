'use strict'

const customOfferService = require('../services/CustomOfferService');

exports.createCustomOffer = async function (req, res) {
    console.log(req.file);
    console.log(req.body);
    let customOffer = {
        file: req.file,
        title: req.body.title,
        description: req.body.description,
        offeredPrice: req.body.offeredPrice,
        offerNftCategory: req.body.offerNftCategory,
        creatorId: req.session.profile.id
    }
    customOfferService.createCustomOffer(customOffer)
        .then(result => {
            res.status(200).send("Custom offer created successfully");
        })
        .catch(e => {
            res.status(500).send("Error while creating custom offer");
        });
};

exports.offersPage = function (req, res) {
    customOfferService.getCustomOffers()
        .then(customOffers => {
            res.status(200).render('offers', {customOffers: customOffers, sessionData:
                    { isAuth: req.session.isAuth, profile: req.session.profile }});
        })
        .catch(err => {
            res.status(404).render('404', {sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
        })
}

exports.offerDetailsPage = function (req, res) {
    customOfferService.findById(req.query.id)
        .then(([customOffer, comments]) => {
            res.status(200).render('offer-details', {customOffer: customOffer, comments: comments, sessionData:
                    { isAuth: req.session.isAuth, profile: req.session.profile }});
        })
        .catch(error => {
            res.status(404).render('404', {sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
        })
}