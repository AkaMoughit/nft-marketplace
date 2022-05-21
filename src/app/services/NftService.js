'use strict'

const nftRepository = require("../repositories/NftRepository");
const {reject} = require("bcrypt/promises");


class NftService {
    constructor(nftRepository) {
        this.nftRepository = nftRepository;
    }

    save(nftTBR, profile_id, filePath) {
        return new Promise( async (resolve, reject) => {
                    this.nftRepository.save(nftTBR, profile_id, filePath)
                        .then(promise => {
                            if (promise) {
                                resolve("created");
                            } else {
                                resolve("not created");
                            }
                        })
                        .catch(err => {
                           console.log(err);
                           reject("error")
                        })
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