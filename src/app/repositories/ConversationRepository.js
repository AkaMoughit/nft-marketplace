const { Op } = require("sequelize");
const BaseRepository = require("./BaseRepository");
const Conversation = require("../models").Conversation;

class ConversationRepository extends BaseRepository {
    constructor(Conversation) {
        super(Conversation);
    }

    findAllByParticipentsIds(participent1Id, participent2Id) {
        return this.model.findAll({
            where: {
                [Op.or]: [{
                    [Op.and]: [{participent1Id: participent1Id}, {participent2Id: participent2Id}]
                },
                {
                    [Op.and]: [{participent1Id: participent2Id}, {participent2Id: participent1Id}]
                }]
            }
        })
    }

    createConversation(participent1Id, participent2Id, customOffer) {
        return this.model.create({
            creation_date: new Date(),
            isCustomOffer: customOffer,
            createdAt: new Date(),
            updatedAt: new Date(),
            participent1Id: participent1Id,
            participent2Id: participent2Id,
        })
    }

    findOrCreate(participent1Id, participent2Id, customOffer) {
        return new Promise(async (resolve, reject) => {
            let conversationsFromDB = await this.findAllByParticipentsIds(participent1Id, participent2Id);
            let conversation;
            conversationsFromDB.forEach(conversationFromDB => {
                if (customOffer) {
                    if (conversationFromDB.dataValues.participent1Id === participent1Id
                        && conversationFromDB.dataValues.participent2Id === participent2Id
                        && conversationFromDB.dataValues.isCustomOffer) {
                        conversation = conversationFromDB.dataValues;
                    }
                } else {
                    if (
                        (conversationFromDB.dataValues.participent1Id === participent1Id
                        && conversationFromDB.dataValues.participent2Id === participent2Id
                        && !conversationFromDB.dataValues.isCustomOffer)
                        || (conversationFromDB.dataValues.participent1Id === participent2Id
                            && conversationFromDB.dataValues.participent2Id === participent1Id
                            && !conversationFromDB.dataValues.isCustomOffer)) {
                        conversation = conversationFromDB.dataValues;
                    }
                }
            })
            if (!conversation) {
                let conversationFromDB = await this.createConversation(participent1Id, participent2Id, customOffer);
                conversation = conversationFromDB.dataValues;
            }
            resolve(conversation);
        })
    }

    findAllByProfileId(id) {
        return this.model.findAll({
            where: {
                [Op.or]: [
                    { participent1Id: id },
                    { participent2Id: id }
                ]
            }
        })
    }

    findById(id) {
        return this.model.findOne({
            where: {
                id: id
            }
        })
    }

    deleteById(id) {
        return this.model.destroy({
            where: {
                id: id
            }
        });
    }
}

module.exports = new ConversationRepository(Conversation);