'use strict'

const { ethers } = require('ethers');

const MarketplaceAddress = require('../contracts/Marketplace-address.json');
const Marketplace = require('../contracts/Marketplace.json');

const NftAddress = require('../contracts/NFT-address.json');
const Nft = require('../contracts/NFT.json');


exports.web3Handler = async function (req, res, next) {

    // req.app.locals.marketplaceContract = marketplaceContract;
    // req.app.locals.loading = false;

    next();
}