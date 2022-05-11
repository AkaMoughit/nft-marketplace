const BaseRepository = require("./BaseRepository");
const NftProfileListingDTO = require("../dtos/NftProfileListingDTO");
const Nft = require("../models").Nft;
const Profile = require("../models").Profile;

class NftRepository extends BaseRepository {
    constructor(Nft, Profile) {
        super(Nft);
        this.profileModel = Profile;
    }

    listAll() {
        return this.model.findAll();
    }

    findByTokenId(tokenId) {
        return this.model.findOne({ where: { token_id: tokenId }});
    }

    findAllNftCards() {
        return new Promise((resolve, reject) => {
            let listNftCards = [];
            this.findAll()
                .then(async nfts => {
                    for (let nft of nfts) {
                        let profile = await this.profileModel.findByPk(nft.ProfileId);
                        if (profile == null) reject("Nft without owner");

                        listNftCards.push(new NftProfileListingDTO(nft, profile));
                    }
                    resolve(listNftCards);
                })
                .catch(err => {
                    reject(err);
                });
        });
    }

    findNftCardByTokenId(tokenId) {
        return new Promise((resolve, reject) => {
            this.findByTokenId(tokenId)
                .then(nft => {
                    this.profileModel.findByPk(nft.ProfileId)
                        .then(profile => {
                            let nftDTO = new NftProfileListingDTO(nft, profile);
                            resolve(nftDTO);
                        })
                        .catch(err => {
                            reject(err);
                        });
                }).catch(err => {
                reject(err);
            });
        });
    }
}

module.exports = new NftRepository(Nft, Profile);