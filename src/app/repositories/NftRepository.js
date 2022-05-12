const BaseRepository = require("./BaseRepository");
const NftProfileListingDTO = require("../dtos/NftProfileListingDTO");
const Nft = require("../models").Nft;
const Profile = require("../models").Profile;
const Listing = require("../models").Listing;
let getDeltaInDHMS = require('../utils/DateHelper');

class NftRepository extends BaseRepository {
    constructor(Nft, Profile, Listing) {
        super(Nft);
        this.profileModel = Profile;
        this.listingModel = Listing;
    }

    findByTokenId(tokenId) {
        return this.model.findOne({ where: { token_id: tokenId }});
    }

    findAllNftCards(limit, offset) {
        return new Promise((resolve, reject) => {
            let listNftCards = [];
            this.model.findAll({ limit: limit, offset: offset })
                .then(async nfts => {
                    for (let nft of nfts) {
                        let profile = await this.profileModel.findByPk(nft.ProfileId);
                        if (profile == null) reject("Nft without owner");
                        let listing = await this.listingModel.findOne({
                            where: {
                                NftId: nft.id,
                                ProfileId: profile.id
                            }
                        });
                        let nftCardDTO = new NftProfileListingDTO(nft, profile, listing);
                        let deltaInDHMS = getDeltaInDHMS(new Date(nftCardDTO.sale_end_date), new Date());
                        nftCardDTO.sale_end_date = deltaInDHMS;
                        listNftCards.push(nftCardDTO);
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
                        .then(async profile => {
                            let listing = await this.listingModel.findOne({
                                where: {
                                    NftId: nft.id,
                                    ProfileId: profile.id
                                }
                            });
                            let nftCardDTO = new NftProfileListingDTO(nft, profile, listing);
                            let deltaInDHMS = getDeltaInDHMS(new Date(nftCardDTO.sale_end_date), new Date());
                            nftCardDTO.sale_end_date = deltaInDHMS;

                            resolve(nftCardDTO);
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

module.exports = new NftRepository(Nft, Profile, Listing);