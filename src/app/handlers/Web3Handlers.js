'use strict'

const { ethers } = require('ethers');
const SmartContractHelper = require("../utils/SmartContractHelper");
const {downloadDataFromIpfs} = require("../utils/UploadHelper");

const nftService = require('../services/NftService');
const walletService = require('../services/WalletService');''

exports.loadingHandler = async function (req, res, next) {

    if(req.app.locals.isFirstLoading === undefined) {
        req.app.locals.isFirstLoading = true;
    }

    if(req.app.locals.isFirstLoading) {
        const provider = new ethers.providers.JsonRpcProvider(SmartContractHelper.rpcUrl);
        let marketplaceContract = new ethers.Contract(SmartContractHelper.marketplaceAddress, SmartContractHelper.marketplaceContract.abi, provider);
        let nftContract = new ethers.Contract(SmartContractHelper.nftAddress, SmartContractHelper.nftContract.abi, provider);

        nftContract.on('Minted', async (tokenId, creatorAddress, tokenURI, contractAddress) => {
            console.log(tokenId.toString(), creatorAddress, tokenURI, contractAddress);
            if(req.session !== undefined && req.session.profile !== undefined) {
                let nftDetails = await downloadDataFromIpfs(tokenURI);

                let wallet = {
                    ProfileId: req.session.profile.id,
                    wallet_id: creatorAddress
                };

                await walletService.insertIfNotExist(wallet);

                const nft = {
                    name : nftDetails.name,
                    description : nftDetails.desc,
                    contract_adress : contractAddress,
                    token_id : tokenId.toString(),
                    creation_date : new Date(),
                    createdAt : new Date(),
                    uri: tokenURI,
                    updatedAt : new Date(),
                    CreatorId : req.session.profile.id
                };

                await nftService.create(nft);
            }
        });

        marketplaceContract.on('Offered', (a, b, c, d, e) => {
            if(!req.app.locals.isFirstLoading) {
                console.log(a.toString(), b, c.toString(), d, e)
            }
        });

        // const itemCount = await marketplaceContract.itemCount();
        // let items = [];
        // for(let i = 1; i <= itemCount; i++) {
        //     const item = await marketplaceContract.items(i);
        //     const totalPrice = await marketplaceContract.getTotalPrice(item.itemId);
        //     items.push({
        //         totalPrice,
        //         itemId: item.itemId,
        //         seller: item.seller,
        //     });
        // }

        req.app.locals.marketplaceContract = marketplaceContract;
        req.app.locals.nftContract = nftContract;
        req.app.locals.isFirstLoading = false;
        // console.log(items);
    }

    next();
}