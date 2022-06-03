const BaseRepository = require("./BaseRepository");
const NftProfileListingDTO = require("../models/dtos/NftCardDTO");
const Nft = require("../models").Nft;
const Profile = require("../models").Profile;
const Listing = require("../models").Listing;
const FavoriteList = require("../models").FavoriteList;
const NftOwnership = require("../models").NftOwnership;
const Attachment = require("../models").Attachment;
const { v4: uuidv4 } = require('uuid');
const uploadHelper = require('../utils/UploadHelper');

const models = require('../models');

let getDeltaInDHMS = require('../utils/DateHelper');

class NftRepository extends BaseRepository {
    constructor(Nft, Profile, Listing, FavoriteList, NftOwnership) {
        super(Nft);
        this.profileModel = Profile;
        this.listingModel = Listing;
        this.favoriteListModel = FavoriteList;
        this.NftOwnership = NftOwnership;
        this.attachment = Attachment;
    }

    create(nft) {
        return new Promise(async (resolve, reject) => {
            this.model.findOne({
                where: {
                    token_id: nft.token_id,
                }
            }).then(async foundNft => {
                if (foundNft === null) {
                    try {
                        let result = await this.model.create(
                            {
                                token_id: nft.token_id,
                                name: nft.name,
                                description: nft.description,
                                contract_adress: nft.contract_adress,
                                uri: nft.uri,
                                category: nft.category,
                                CreatorId: nft.CreatorId,
                                creation_date: new Date(),
                                createdAt: new Date(),
                                updatedAt: new Date(),
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
                    resolve(foundNft);
                }
            }).catch(rejection => {
                console.log(rejection);
                reject(rejection);
            });
        });
    }

    //TO-DO : transaction commits and rollbacks
    save(nftTBR, profile_id, file) {
        const address = uuidv4();
        const token_id = uuidv4();
        return new Promise(async (resolve, reject) => {
            try {
                const fileHash = await uploadHelper.uploadFileToIpfs(file.path);

                const url = "ipfs.io/ipfs/" + fileHash;

                const nft = await this.model.create({
                    name : nftTBR.name,
                    description : nftTBR.description,
                    contract_adress : address,
                    token_id : token_id,
                    creation_date : new Date(),
                    createdAt : new Date(),
                    updatedAt : new Date(),
                    CreatorId : profile_id
                });
                if (nft) {
                    console.log("pages saved");
                    const listing = await this.listingModel.create({
                        price : nftTBR.price,
                        type : nftTBR.listingType,
                        NftId : nft.id,
                        SellerId : profile_id,
                        createdAt : new Date(),
                        updatedAt : new Date()
                    });
                    if (listing) {
                        console.log("listing saved");
                        const attachment = await this.attachment.create({
                            reference_table : "nfts",
                            attachment_url : url,
                            NftId : nft.id,
                            createdAt : new Date(),
                            updatedAt : new Date()
                        })
                        if (attachment) {
                            console.log("attachment saved");
                            resolve(true);
                        } else {
                            console.log("attachment not saved");
                            resolve(false);
                        }
                    } else {
                        console.log("listing not saved");
                        resolve(false);
                    }
                } else {
                    console.log("pages not saved");
                    resolve(false);
                }
            } catch (err) {
                console.log(err);
                reject(false);
            }
        });
    }

    findAllByOwnerPk(ownerId) {
        return this.model.findAll({
            include: [
                {
                    model: this.NftOwnership,
                    where: {
                        OwnerId: ownerId
                    }
                }
            ]
        });
    }

    findByCreatorPk(creatorPk) {
        return this.model.findAll({
            where: {
                creatorId: creatorPk
            }
        });
    }

    findByTokenId(tokenId) {
        return this.model.findOne({ where: { token_id: tokenId }});
    }

    findFavoriteCountByTokenId(tokenId) {
        return new Promise(async (resolve, reject) => {
            try {
                let nft = await this.findByTokenId(tokenId);
                let favoriteList = await this.favoriteListModel.findAndCountAll({
                    where: {
                        NftId: nft.id
                    }
                });

                resolve(favoriteList.count);
            } catch (err) {
                reject(err);
            }
        });
    }

    findAllNftCardsOrderedByFavoriteCount(limit, offset, name) {
        return new Promise(async (resolve, reject) => {
            let listNftCards = [];
            let nfts;
            try {
                nfts = await this.model.findAndCountAll({
                    limit: limit,
                    offset: offset,
                    where: {
                        name: {
                            [models.Sequelize.Op.like]: name==null?"%":"%"+name+"%"
                        }
                    },
                    include: [
                        'owner',
                        this.listingModel
                    ],
                    attributes: [
                        "contract_adress",
                        "token_id",
                        "description",
                        "name",
                        [this.model.sequelize.literal('(SELECT COUNT(*) FROM FavoriteLists WHERE FavoriteLists.NftId = Nft.id)'), 'favoritesCount']
                    ],
                    order: [[this.model.sequelize.literal('favoritesCount'), 'DESC']],
                });
            }catch(err) {
                reject(err);
            }

            for (let nft of nfts.rows) {

                let nftCardDTO = new NftProfileListingDTO(nft, nft.owner, nft.Listing, nft.dataValues.favoritesCount);
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

module.exports = new NftRepository(Nft, Profile, Listing, FavoriteList, NftOwnership);