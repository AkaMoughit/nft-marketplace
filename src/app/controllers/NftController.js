const nftService = require("../services/NftService");
const listingService = require("../services/ListingService");
const {response} = require("express");

let pageIndex = 1;

exports.nftsPage = function(req, res) {
    let pageNumberElements = 16;

    if(req.query.loadMore !== undefined) pageIndex++;
    // else if(req.query.pageIndex > 0) pageIndex = req.query.pageIndex;
    else pageIndex = 1;

    listingService.findAllActiveListings(pageNumberElements, pageNumberElements * (pageIndex - 1), req.query.searchedNft)
        .then(nftCards => {
            let isLastPage = false;
            if (pageIndex >= 0 && pageIndex > Math.floor(nftCards.count / pageNumberElements)){
                isLastPage = true;
                pageIndex = Math.floor(nftCards.count / pageNumberElements);
            }

            res.status(200).render('explore', { nfts: nftCards.rows, isLastPage: isLastPage });
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