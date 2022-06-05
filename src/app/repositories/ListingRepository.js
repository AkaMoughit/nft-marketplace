const BaseRepository = require("./BaseRepository");
const NftProfileListingDTO = require("../models/dtos/NftCardDTO");
const getDeltaInDHMS = require("../utils/DateHelper");
const models = require("../models");
const {downloadDataFromIpfs} = require("../utils/UploadHelper");
const Listing = require('../models').Listing;
const Profile = require('../models').Profile;

const Op = require('../models').Sequelize.Op;

class ListingRepository extends BaseRepository {
    constructor(Listing, Profile) {
        super(Listing);
        this.profileModel = Profile;
    }

    updateById(listingId, listing) {
        return this.model.update(
            listing,
            {
                where: {
                    id: listingId,
                    transaction_date: null,
                    BuyerId: null
                },
                individualHooks: true
            },

        );
    }

    create(listing) {
        return new Promise(async (resolve, reject) => {
            this.model.findOne({
                where: {
                    id: listing.id,
                }
            }).then(async foundListing => {
                if (foundListing === null) {
                    try {
                        let result = await this.model.create(
                            {
                                id: listing.id,
                                price: listing.price,
                                type: listing.type,
                                sale_end_date: listing.sale_end_date,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                                NftId: listing.NftId,
                                SellerId: listing.SellerId
                            }, {
                                individualHooks: true,
                            },
                        );
                        resolve(result);
                    } catch (e) {
                        console.log(e);
                        reject(e);
                    }
                } else {
                    resolve(foundListing);
                }
            }).catch(rejection => {
                console.log(rejection);
                reject(rejection);
            });
        });
    }

    findListingByTokenId(tokenId) {
        return new Promise(async (resolve, reject) => {
            try {
                let listing = await this.model.findOne({
                    include: [
                        {
                            model: models.Nft,
                            where: {
                                token_id: tokenId
                            },
                            include: [
                                {
                                    model: models.NftOwnership,
                                    where: {
                                        NftId: {
                                            [Op.col]: 'Nft.id'
                                        }
                                    },
                                },
                            ],
                        },

                    ],
                    order: [['createdAt', 'DESC']],
                    // where: {
                    //     transaction_date: {
                    //         [Op.is]: null
                    //     },
                    //     sale_end_date:  {
                    //         [Op.gt]: new Date()
                    //     }
                    // },
                });

                let owner = await this.profileModel.findOne({
                    where: {
                        id: listing.Nft.NftOwnership.OwnerId
                    }
                });
                let nftCardDTO = new NftProfileListingDTO(listing.Nft, owner.dataValues, listing.dataValues);
                let deltaInDHMS = getDeltaInDHMS(new Date(nftCardDTO.sale_end_date), new Date());
                nftCardDTO.sale_end_date = deltaInDHMS;

                resolve(nftCardDTO);
            } catch (err) {
                reject(err);
            }
        });
    }

    findAllActiveListings(limit, offset, name) {
        return new Promise(async (resolve, reject) => {
            try {
                let allActiveListings = await this.model.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    include: [
                        'Seller',
                        {
                            model: models.Nft,
                            where: {
                                name: {
                                    [Op.like]: name==null?"%":"%"+name+"%"
                                }
                            }
                        }
                    ],
                    where: {
                        transaction_date: {
                            [Op.is]: null
                        },
                        sale_end_date:  {
                            [Op.gt]: new Date()
                        }
                    },
                    attributes:[
                        'price',
                        'type',
                        'sale_end_date',
                        'transaction_date',
                        'NftId',
                        'SellerId',
                        [this.model.sequelize.literal('(SELECT COUNT(*) FROM FavoriteLists WHERE FavoriteLists.NftId = Nft.id)'), 'favoritesCount']
                    ],
                    order: [[this.model.sequelize.literal('favoritesCount'), 'DESC']]
                });

                let listNftCards = await this.extractNftCards(allActiveListings);

                resolve({ count: allActiveListings.count, rows: listNftCards });
            }catch (err) {
                reject(err);
            }
        })
    }
    findAllActiveListingsByProfilePk(limit, offset, name, profilePk) {
        return new Promise(async (resolve, reject) => {
            try {
                let allActiveListings = await this.model.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    include: [
                        'Seller',
                        {
                            model: models.Nft,
                            where: {
                                name: {
                                    [Op.like]: name==null?"%":"%"+name+"%"
                                }
                            }
                        }
                    ],
                    where: {
                        transaction_date: {
                            [Op.is]: null
                        },
                        sale_end_date:  {
                            [Op.gt]: new Date()
                        },
                        SellerId: profilePk
                    },
                    attributes:[
                        'price',
                        'type',
                        'sale_end_date',
                        'transaction_date',
                        'NftId',
                        'SellerId',
                        [this.model.sequelize.literal('(SELECT COUNT(*) FROM FavoriteLists WHERE FavoriteLists.NftId = Nft.id)'), 'favoritesCount']
                    ],
                    order: [[this.model.sequelize.literal('favoritesCount'), 'DESC']]
                });

                let listNftCards = await this.extractNftCards(allActiveListings);

                resolve({ count: allActiveListings.count, rows: listNftCards });
            }catch (err) {
                reject(err);
            }
        })
    }

    async extractNftCards(allActiveListings) {
        let listNftCards = [];

        for (let listing of allActiveListings.rows) {

            let nftCardDTO = new NftProfileListingDTO(listing.Nft, listing.Seller, listing.dataValues, listing.dataValues.favoritesCount, true);
            let deltaInDHMS = getDeltaInDHMS(new Date(nftCardDTO.sale_end_date), new Date());
            nftCardDTO.sale_end_date = deltaInDHMS;

            listNftCards.push(nftCardDTO);
        }
        return listNftCards;
    }
}

module.exports = new ListingRepository(Listing,Profile);