const nftService = require("../services/NftService");
const {response} = require("express");

exports.nftsPage = function(req, res) {
    nftService.findAllNftCards()
        .then(listNftDTO => {
            res.status(200).render('explore', { nfts: listNftDTO });
        }).catch(err => {
            res.status(404).render('404', {error: err});
        });
}

exports.itemDetailsPage = function (req, res) {
    nftService.findNftCardByTokenId(req.query.nft_id)
        .then(nftDTO => {
            res.status(200).render('item-details', { nft: nftDTO });
        }).catch(err => {
            res.status(404).render('404', {error: err});
    });
}