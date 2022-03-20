const BaseRepository = require("./baseRepository");
var User = require('../models').User;

class UserRepository extends BaseRepository {
    constructor(User) {
        super(User);
    }
}

module.exports = new UserRepository(User);