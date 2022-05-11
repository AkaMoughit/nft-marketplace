const nftService = require("../services/NftService");
const {response} = require("express");

exports.nftsPage = function(request, response) {
    nftService.listAll()
        .then(data => {
            response.status(200).render('explore', { result: data });
        }).catch(err => {
            response.status(404).send(err);
        });
}

exports.itemDetailsPage = function (req, res) {
    nftService.findByTokenId(req.query.nft_id)
        .then(nftDTO => {
            res.status(200).render('item-details', { nft: nftDTO });
        }).catch(err => {
            res.status(404).render('404', {error: err});
    });
}