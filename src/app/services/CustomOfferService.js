'use strict'

const profileRepository = require("../repositories/ProfileRepository");
const nftRepository = require("../repositories/NftRepository");
const listingRepository = require("../repositories/ListingRepository");
const userRepository = require("../repositories/UserRepository");
const walletRepository = require("../repositories/WalletRepository")
const AuthorDTO = require("../models/dtos/AuthorDTO");
const NftProfileListingDTO = require("../models/dtos/NftCardDTO");
const getDeltaInDHMS = require("../utils/DateHelper");
const bcrypt = require('bcrypt');

const customOfferModel = require('../models').CustomOffer;

class CustomOfferService {
    constructor(profileRepository, nftRepository, listingRepository, userRepository, walletRepository) {
        this.profileRepository = profileRepository;
        this.nftRepository = nftRepository;
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    createCustomOffer(customoffer) {
        return new Promise(async (resolve, reject) => {
            try {
                let relativeFilePath = customoffer.file.path.replace('src/client/public/', '');
                let result = await customOfferModel.create({
                    title: customoffer.title,
                    body: customoffer.description,
                    value_offered: customoffer.offeredPrice,
                    creation_date: new Date(),
                    attachment_url: relativeFilePath,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    ProfileId: customoffer.creatorId
                });
                return resolve(result);
            } catch (e) {
                console.log(e);
                reject(e);
            }
        });
    }

}
module.exports = new CustomOfferService(profileRepository, nftRepository, listingRepository, userRepository, walletRepository);