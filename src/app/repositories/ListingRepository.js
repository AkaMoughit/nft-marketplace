const BaseRepository = require("./BaseRepository");
const NftProfileListingDTO = require("../dtos/NftCardDTO");
const getDeltaInDHMS = require("../utils/DateHelper");
const Listing = require('../models').Listing;

const Op = require('../models').Sequelize.Op;

class ListingRepository extends BaseRepository {
    constructor(Listing) {
        super(Listing);
    }

    findAllActiveListings(limit, offset) {
        return new Promise(async (resolve, reject) => {
            try {
                let allActiveListings = await this.model.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    include: [
                        'Seller',
                        'Nft'
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

                let listNftCards = [];

                for (let listing of allActiveListings.rows) {

                    let nftCardDTO = new NftProfileListingDTO(listing.Nft, listing.Seller, listing.dataValues, listing.dataValues.favoritesCount);
                    let deltaInDHMS = getDeltaInDHMS(new Date(nftCardDTO.sale_end_date), new Date());
                    nftCardDTO.sale_end_date = deltaInDHMS;

                    listNftCards.push(nftCardDTO);
                }

                resolve(listNftCards);
            }catch (err) {
                reject(err);
            }
        })
    }
}

module.exports = new ListingRepository(Listing);