const nftService = require("../services/NftService");
const {response} = require("express");

let pageIndex = 1;

exports.nftsPage = function(req, res) {
    let pageNumberElements = 16;

    if(req.query.loadMore !== undefined) pageIndex++;
    else if(req.query.pageIndex > 0) pageIndex = req.query.pageIndex;
    else pageIndex = 1;

    nftService.findAllNftCards(pageNumberElements, pageNumberElements * (pageIndex - 1))
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