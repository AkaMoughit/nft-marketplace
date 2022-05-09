const BaseRepository = require("./BaseRepository");
const User = require('../models').User;

class UserRepository extends BaseRepository {
    constructor(User) {
        super(User);
    }
}

module.exports = new UserRepository(User);