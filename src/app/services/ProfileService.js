const profileRepository = require("../repositories/ProfileRepository");

class ProfileService {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }

    findByProfileId(profileId) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await this.profileRepository.findByProfileId(profileId);
                if ( result == null ) {
                    reject("Profile not found");
                }
                resolve(result);
            } catch (err) {
               reject("Profile Not found");
            }
        });
    }
}
module.exports = new ProfileService(profileRepository);