const BaseRepository = require("./BaseRepository");
const Profile = require("../models").Profile;

class ProfileRepository extends BaseRepository {
    constructor(Profile) {
        super(Profile);
    }

    listAll() {
        return this.model.findAll();
    }

    findByPk(id) {
        return this.model.findByPk(id);
    }

}

module.exports = new ProfileRepository(Profile);