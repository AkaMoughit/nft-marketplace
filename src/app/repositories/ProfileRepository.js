const BaseRepository = require("./BaseRepository");
const Profile = require("../models").Profile;

class ProfileRepository extends BaseRepository {
    constructor(Profile) {
        super(Profile);
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

module.exports = new ProfileRepository(Profile);