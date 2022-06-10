'use strict'

const nftRepository = require("../repositories/NftRepository");
const favoriteListRepository = require('../repositories/FavoriteListRepository');
const {reject} = require("bcrypt/promises");


class NftService {
    constructor(nftRepository, favoriteListRepository) {
        this.nftRepository = nftRepository;
        this.favoriteListRepository = favoriteListRepository;
    }

    findByTokenId(tokenId) {
        return this.nftRepository.findByTokenId(tokenId);
    }

    create(nft) {
        return this.nftRepository.create(nft);
    }

    saveAndList(nftTBR, profile_id, file) {
        return new Promise( async (resolve, reject) => {
            if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
                || file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
                this.nftRepository.saveAndList(nftTBR, profile_id, file)
                .then(promise => {
                    if (promise) {
                        resolve("NFT created");
                    } else {
                        reject("NFT not created");
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject("An error has occurred")
                })
            } else {
                reject("File format not supported");
            }
        });
    }

    listAll() {
        return this.nftRepository.listAll();
    }

    toggleFavorite(profileId, nftTokenId) {
        return new Promise(async (resolve, reject) => {
            try {
                let nft = await this.nftRepository.findByTokenId(nftTokenId);
                let favoriteList = await this.favoriteListRepository.findByProfileIdAndNftId(profileId, nft.dataValues.id);

                if (favoriteList) {
                    await this.favoriteListRepository.deleteByProfileIdAndNftId(profileId, nft.dataValues.id);
                } else {
                    await this.favoriteListRepository.add(profileId, nft.dataValues.id);
                }

                let nftFavoriteCount = await this.favoriteListRepository.countByNftId(nft.dataValues.id);
                resolve(nftFavoriteCount);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }

    // deprecated
    findNftCardByTokenId(tokenId) {
        return this.nftRepository.findNftCardByTokenId(tokenId);

    }

    // deprecated
    findAllNftCardsOrderedByFavoriteCount(limit, offset, name=null) {
        return this.nftRepository.findAllNftCardsOrderedByFavoriteCount(limit, offset, name);
    }
}
module.exports = new NftService(nftRepository, favoriteListRepository);