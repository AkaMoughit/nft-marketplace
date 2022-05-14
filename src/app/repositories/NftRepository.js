const BaseRepository = require("./BaseRepository");
const NftProfileListingDTO = require("../dtos/NftCardDTO");
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

    findAllNftCardsOrderedByFavoriteCount(limit, offset) {
        return new Promise(async (resolve, reject) => {
            let listNftCards = [];
            let nfts;
            try {
                nfts = await this.model.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    include: [
                        this.profileModel,
                        this.listingModel
                    ],
                    attributes: [
                        "contract_adress",
                        "token_id",
                        "description",
                        "name",
                        [this.model.sequelize.literal('(SELECT COUNT(*) FROM FavoriteLists WHERE FavoriteLists.NftId = Nft.id)'), 'favoritesCount']
                    ],
                    order: [[this.model.sequelize.literal('favoritesCount'), 'DESC']]
                });
            }catch(err) {
                reject(err);
            }

            for (let nft of nfts.rows) {

                let nftCardDTO = new NftProfileListingDTO(nft, nft.Profile, nft.Listings[0], nft.dataValues.favoritesCount);
                let deltaInDHMS = getDeltaInDHMS(new Date(nftCardDTO.sale_end_date), new Date());
                nftCardDTO.sale_end_date = deltaInDHMS;

                listNftCards.push(nftCardDTO);
            }
            resolve({ count: nfts.count, rows: listNftCards });
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