const BaseRepository = require("./BaseRepository");
const NftProfileListingDTO = require("../models/dtos/NftCardDTO");
const getDeltaInDHMS = require("../utils/DateHelper");
const models = require("../models");
const Listing = require('../models').Listing;

const Op = require('../models').Sequelize.Op;

class ListingRepository extends BaseRepository {
    constructor(Listing) {
        super(Listing);
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
                            }
                        },
                        'Seller'
                    ],
                    // where: {
                    //     transaction_date: {
                    //         [Op.is]: null
                    //     },
                    //     sale_end_date:  {
                    //         [Op.gt]: new Date()
                    //     }
                    // },
                });

                let nftCardDTO = new NftProfileListingDTO(listing.Nft, listing.Seller, listing.dataValues);
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

                let listNftCards = this.extractNftCards(allActiveListings);

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

                let listNftCards = this.extractNftCards(allActiveListings);

                resolve({ count: allActiveListings.count, rows: listNftCards });
            }catch (err) {
                reject(err);
            }
        })
    }

    extractNftCards(allActiveListings) {
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

module.exports = new ListingRepository(Listing);