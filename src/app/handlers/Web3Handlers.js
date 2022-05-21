'use strict'

const { ethers } = require('ethers');

const MarketplaceAddress = require('../contracts/Marketplace-address.json');
const Marketplace = require('../contracts/Marketplace.json');

const NftAddress = require('../contracts/NFT-address.json');
const Nft = require('../contracts/NFT.json');


exports.web3Handler = async function (req, res, next) {

    console.log(req.body.data);


    const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, provider);

    req.app.locals.marketplaceContract = marketplaceContract;
    req.app.locals.loading = false;

    next();
}