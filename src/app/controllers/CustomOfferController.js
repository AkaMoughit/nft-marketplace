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