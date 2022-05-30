'use strict'

const nftRepository = require("../repositories/NftRepository");
const {reject} = require("bcrypt/promises");


class NftService {
    constructor(nftRepository) {
        this.nftRepository = nftRepository;
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

    findNftCardByTokenId(tokenId) {
        return this.nftRepository.findNftCardByTokenId(tokenId);

    }

    findAllNftCardsOrderedByFavoriteCount(limit, offset, name=null) {
        return this.nftRepository.findAllNftCardsOrderedByFavoriteCount(limit, offset, name);
    }
}
module.exports = new NftService(nftRepository);