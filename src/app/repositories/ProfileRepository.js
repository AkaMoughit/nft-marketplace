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

}

module.exports = new ProfileRepository(Profile, Listing, Nft, NftOwnership);