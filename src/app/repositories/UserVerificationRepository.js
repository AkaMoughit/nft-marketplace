const BaseRepository = require("./BaseRepository");
const UserVerification = require("../models").UserVerification;

class UserVerificationRepository extends BaseRepository {
    constructor(UserVerification) {
        super(UserVerification);
    }

    deleteByUserId(userId) {
        return this.model.destroy({
            where: {
                UserId: userId
            }
        });
    }

    createOrUpdate(userVerification, transaction) {
        return this.model.upsert(
            userVerification,
            {
                where: {
                    UserId: userVerification.UserId
                },
                transaction: transaction
            }
        );
    }

    findByVerificationCode(verificationCode) {
        return this.model.findOne({
            where: {
                verificationCode: verificationCode
            }
        });
    }

    findById(id) {
        return this.model.findOne({
            where: {
                id: id
            }
        })
    }
}

module.exports = new UserVerificationRepository(UserVerification);