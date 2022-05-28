const BaseRepository = require("./BaseRepository");
const Message = require("../models").Message;

class MessageRepository extends BaseRepository {
    constructor(Message) {
        super(Message);
    }

    save(message) {
        return this.model.create({
            send_date: new Date(),
            body: message.body,
            ConversationId: message.ConversationId,
            ProfileId: message.ProfileId
        })
    }

    findAllByConversationId(conversationId) {
        return this.model.findAll({
            where: {
                ConversationId: conversationId
            }
        });
    }

}

module.exports = new MessageRepository(Message);