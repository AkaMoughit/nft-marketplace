'use strict'

const { ethers } = require('ethers');
const SmartContractHelper = require("../utils/SmartContractHelper");
const {downloadDataFromIpfs} = require("../utils/UploadHelper");

const nftService = require('../services/NftService');
const walletService = require('../services/WalletService');
const listingService = require('../services/ListingService');

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

const sale_end_date = 7;
exports.loadingHandler = async function (req, res, next) {

    if(req.app.locals.isFirstLoading === undefined) {
        req.app.locals.isFirstLoading = true;
    }

    if(req.app.locals.isFirstLoading) {
        const provider = new ethers.providers.JsonRpcProvider(SmartContractHelper.rpcUrl);
        let marketplaceContract = new ethers.Contract(SmartContractHelper.marketplaceAddress, SmartContractHelper.marketplaceContract.abi, provider);
        let nftContract = new ethers.Contract(SmartContractHelper.nftAddress, SmartContractHelper.nftContract.abi, provider);

        nftContract.on('Minted', async (tokenId, creatorAddress, tokenURI, contractAddress) => {
            async function createNft () {
                try {
                    let nftDetails = await downloadDataFromIpfs(tokenURI);

                    let wallet = {
                        ProfileId: req.session.profile.id,
                        wallet_id: creatorAddress
                    };

                    await walletService.insertIfNotExist(wallet);

                    const nft = {
                        name: nftDetails.name,
                        description: nftDetails.desc,
                        contract_adress: contractAddress,
                        token_id: tokenId.toString(),
                        creation_date: new Date(),
                        createdAt: new Date(),
                        uri: tokenURI,
                        category: nftDetails.nftCategory,
                        updatedAt: new Date(),
                        CreatorId: req.session.profile.id
                    };

                    await nftService.create(nft);
                } catch (e) {
                    console.log(e);
                }
            }


            console.log(tokenId.toString(), creatorAddress, tokenURI, contractAddress);
            req.session.reload(async function (err) {
                if (err) {
                    console.log(err);
                }
                await createNft();
            });
        });

        marketplaceContract.on('Offered', (listingId, nftAddress, tokenId, price, sellerAddress) => {
            async function listNft() {

                try {
                    let wallet = {
                        ProfileId: req.session.profile.id,
                        wallet_id: sellerAddress
                    };

                    await walletService.insertIfNotExist(wallet);

                    let listedNft = await nftService.findByTokenId(tokenId.toString());

                    const listing = {
                        id: listingId,
                        price: fromWei(price),
                        type: 'NORMAL',
                        sale_end_date: new Date(new Date().setDate(new Date().getDate() + sale_end_date)),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        NftId: listedNft.id,
                        SellerId: req.session.profile.id
                    }

                    await listingService.create(listing);
                } catch (e) {
                    console.log(e);
                }
            }

            console.log(listingId.toString(), nftAddress, tokenId.toString(), price.toString(), sellerAddress);
            req.session.reload(async function (err) {
                if (err) {
                    console.log(err);
                }
                await listNft();
            });
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

        console.log(items);

        req.app.locals.marketplaceContract = marketplaceContract;
        req.app.locals.nftContract = nftContract;
        req.app.locals.isFirstLoading = false;
        // console.log(items);
    }

    next();
}