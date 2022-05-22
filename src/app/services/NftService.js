'use strict'

const nftRepository = require("../repositories/NftRepository");
const {reject} = require("bcrypt/promises");


class NftService {
    constructor(nftRepository) {
        this.nftRepository = nftRepository;
    }

    save(nftTBR, profile_id, file) {
        return new Promise( async (resolve, reject) => {
            if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'
                || file.mimetype === 'audio/mpeg' || file.mimetype === 'audio/mp3') {
                this.nftRepository.save(nftTBR, profile_id, file)
                .then(promise => {
                    if (promise) {
                        resolve("NFT created");
                    } else {
                        resolve("NFT not created");
                    }
                })
                .catch(err => {
                    console.log(err);
                    reject("An error has occurred")
                })
            } else {
                resolve("File format not supported");
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