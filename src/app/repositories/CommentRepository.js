const BaseRepository = require("./BaseRepository");
const Comment = require("../models").Comment;

class ConversationRepository extends BaseRepository {
    constructor(Comment) {
        super(Comment);
    }

    async countByCustomOfferId(customOfferId) {
        return this.model.count({
            where: {
                CustomOfferId: customOfferId
            }
        });
    }

    async findAll() {
        return super.findAll();
    }

    async findAllByCustomOfferId(customOfferId) {
        return this.model.findAll({
            where: {
                CustomOfferId : customOfferId
            }
        });
    }

}

module.exports = new ConversationRepository(Comment);