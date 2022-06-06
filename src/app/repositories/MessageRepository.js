const BaseRepository = require("./BaseRepository");
const Message = require("../models").Message;
const models = require("../models");

class MessageRepository extends BaseRepository {
    constructor(Message) {
        super(Message);
    }

    save(message) {
        return this.model.create({
            send_date: new Date(),
            body: message.body,
            ConversationId: message.ConversationId,
            ProfileId: message.ProfileId,
            ListingId: message.ListingId
        })
    }

    findAllByConversationId(conversationId) {
        return this.model.findAll({
            where: {
                ConversationId: conversationId
            },
            include: [
                {
                    model: models.Listing,
                    include: [
                        models.Nft
                    ]
                }
            ]
        });
    }

    findDetailedById(id) {
        return this.model.findOne({
            where: {
                id: id
            },
            include: [
                {
                    model: models.Listing,
                    include: [
                        models.Nft
                    ]
                }
            ]
        });
    }

}

module.exports = new MessageRepository(Message);