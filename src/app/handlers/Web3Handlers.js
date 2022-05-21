'use strict'

const { ethers } = require('ethers');

const MarketplaceAddress = require('../contracts/Marketplace-address.json');
const Marketplace = require('../contracts/Marketplace.json');

const NftAddress = require('../contracts/NFT-address.json');
const Nft = require('../contracts/NFT.json');



exports.web3Handler = async function (req, res, next) {

    console.log(req.body);
    let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, req.body.signer);
    // req.app.locals.nft = new ethers.Contract(NftAddress, Nft.abi);

    // const itemCount = await marketplaceContract.itemCount();

    req.app.locals.loading = false;
    next();
}