'use strict'

const profileRepository = require("../repositories/ProfileRepository");
const nftRepository = require("../repositories/NftRepository");
const listingRepository = require("../repositories/ListingRepository");
const userRepository = require("../repositories/UserRepository");
const walletRepository = require("../repositories/WalletRepository");
const commentRepository = require('../repositories/CommentRepository')
const AuthorDTO = require("../models/dtos/AuthorDTO");
const NftProfileListingDTO = require("../models/dtos/NftCardDTO");
const getDeltaInDHMS = require("../utils/DateHelper");
const bcrypt = require('bcrypt');
const path = require("path");

const customOfferModel = require('../models').CustomOffer;

class CustomOfferService {
    constructor(profileRepository, nftRepository, listingRepository, userRepository, walletRepository, commentRepository) {
        this.profileRepository = profileRepository;
        this.nftRepository = nftRepository;
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
        this.commentRepository = commentRepository;
    }

    createCustomOffer(customoffer) {
        return new Promise(async (resolve, reject) => {
            try {
                let relativeFilePath;
                if (customoffer.file) {
                    relativeFilePath = customoffer.file.path
                        .split(path.sep)
                        .join(path.posix.sep)
                        .replace('src/client/public/', '');
                }

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

    getCustomOffers() {
        return new Promise(async (resolve, reject) => {
            try {
                let customOffers = [];
                const customOffersFromDB = await customOfferModel.findAll();
                for (const customOfferFromDB of customOffersFromDB) {
                    let customOffer = customOfferFromDB.dataValues;
                    let profile = await this.profileRepository.findById(customOfferFromDB.ProfileId);
                    customOffer.creator = profile.dataValues;
                    customOffer.commentsCount = await this.commentRepository.countByCustomOfferId(customOffer.id);
                    customOffers.push(customOffer);
                }
                resolve(customOffers);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }

    async findById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                let customOfferFromDB = await customOfferModel.findOne({
                    where: {
                        id: id
                    }
                })

                if (!customOfferFromDB) throw new Error("Custom Offer not found");

                let customOffer = customOfferFromDB.dataValues;
                let profile = await this.profileRepository.findById(customOffer.ProfileId);
                customOffer.creator = profile.dataValues;

                let comments = [];
                let commentsFromDB = await this.commentRepository.findAllByCustomOfferId(customOffer.id);
                for (const commentFromDB of commentsFromDB) {
                    let comment = commentFromDB.dataValues;
                    const commentCreator = await this.profileRepository.findById(comment.ProfileId);
                    comment.creator = commentCreator.dataValues;
                    comments.push(comment);
                }

                console.log(customOffer, comments);
                resolve([customOffer, comments]);
            } catch (error) {
                console.log(error);
                reject(error)
            }
        })
    }
}
module.exports = new CustomOfferService(profileRepository, nftRepository, listingRepository, userRepository,
    walletRepository, commentRepository);