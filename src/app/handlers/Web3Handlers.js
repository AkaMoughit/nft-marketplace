'use strict'

const { ethers } = require('ethers');

const MarketplaceAddress = require('../contracts/Marketplace-address.json');
const Marketplace = require('../contracts/Marketplace.json');

const NftAddress = require('../contracts/NFT-address.json');
const Nft = require('../contracts/NFT.json');


exports.loadingHandler = async function (req, res, next) {

    if(req.app.locals.isFirstLoading === undefined) {
        req.app.locals.isFirstLoading = true;
    }

    if(req.app.locals.isFirstLoading) {
        const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
        let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, provider);
        let nftContract = new ethers.Contract(NftAddress, Nft.abi, provider);

        nftContract.on('Minted', (a, b, c) => {
            if(!req.app.locals.isFirstLoading) {
                console.log(a.toString(), b, c);
            }
        });

        marketplaceContract.on('Offered', (a, b, c, d, e) => {
            if(!req.app.locals.isFirstLoading) {
                console.log(a.toString(), b, c.toString(), d, e)
            }
        });

        const itemCount = await marketplaceContract.itemCount();
        let items = [];
        for(let i = 1; i <= itemCount; i++) {
            const item = await marketplaceContract.items(i);
            const totalPrice = await marketplaceContract.getTotalPrice(item.itemId);
            items.push({
                totalPrice,
                itemId: item.itemId,
                seller: item.seller,
            });
        }

        req.app.locals.marketplaceContract = marketplaceContract;
        req.app.locals.nftContract = nftContract;
        req.app.locals.isFirstLoading = false;
        // console.log(items);
    }

    next();
}