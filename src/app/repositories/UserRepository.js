const BaseRepository = require("./BaseRepository");
const User = require("../models").User;
const bcrypt = require('bcrypt')

class UserRepository extends BaseRepository {
    constructor(User) {
        super(User);
    }

    async save(user) {
        const {email, password, phone_number} = user
        const hashedPwd = await bcrypt.hash(password, 10);
        return this.model.findOrCreate({
            where: {
                email : email
            },
            defaults: {
                email : email,
                password : hashedPwd,
                phone_number : phone_number
            },
            individualHooks : true
        })
    }

    findByEmail(email) {
        return this.model.findOne({
            where: {
                email : email
            }
        });
    }
}

module.exports = new UserRepository(User);