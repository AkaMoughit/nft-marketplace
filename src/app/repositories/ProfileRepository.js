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

}

module.exports = new ProfileRepository(Profile);