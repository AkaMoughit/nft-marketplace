const BaseRepository = require("./BaseRepository");
const models = require("../models");
const Profile = require("../models").Profile;
const Listing = require("../models").Listing
const Nft = require("../models").Nft

class ProfileRepository extends BaseRepository {
    constructor(Profile, Listing, Nft) {
        super(Profile);
        this.listingModel = Listing;
        this.nftModel = Nft;
    }

    findById(id) {
        return this.model.findOne({
            where: {
                id: id
            }
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

    findAboutByProfileId(profileId) {
        return this.model.findOne({
            where: {
                profile_id: profileId
            }
        });
    }

    findOnSaleByProfile(profileAbout) {
        return this.listingModel.findAll({
            include: [
                this.nftModel
            ],
            where: {
                ProfileId: profileAbout.id
            }
        });
    }

}

module.exports = new ProfileRepository(Profile, Listing, Nft);