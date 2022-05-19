const BaseRepository = require("./BaseRepository");
const models = require("../models");
const Profile = require("../models").Profile;
const Listing = require("../models").Listing;
const Nft = require("../models").Nft;
const NftOwnership = require("../models").NftOwnership

class ProfileRepository extends BaseRepository {
    constructor(Profile, Listing, Nft, NftOwnership) {
        super(Profile);
        this.listingModel = Listing;
        this.nftModel = Nft;
        this.nftOwnershipModel = NftOwnership;
    }

    findByOwnedNftPk(ownNftPk) {
        return this.model.findOne({
            include: [
                {
                    model: this.nftOwnershipModel,
                    as: 'Owner',
                    where: {
                        NftId: ownNftPk
                    }
                }
            ]
        });
    }

    findAll(limit, offset, name) {
        return this.model.findAndCountAll({
            limit: limit,
            offset: offset,
            where: {
                name: {
                    [models.Sequelize.Op.like]: name==null?"%":"%"+name+"%"
                }
            }
        });
    }

    findByProfileId(profileId) {
        return this.model.findOne({
            where: {
                profile_id: profileId
            }
        });
    }

    findByuserId(userId) {
        return this.model.findOne({
            where: {
                userId : userId
            }
        });
    }

    save(profile) {
        return this.model.findOrCreate({
            where: {
                profile_id : profile.profile_id,
            },
            defaults: {
                name : profile.name,
                acc_creation_date : new Date(),
                blockchain_type : "ETHEREUM",
                specialize_in : profile.specialize_in,
                birthdate : profile.birthdate,
                createdAt : new Date(),
                updatedAt : new Date(),
                profile_id : profile.profile_id,
                UserId : profile.UserId
            }
        });
    }

}

module.exports = new ProfileRepository(Profile, Listing, Nft, NftOwnership);