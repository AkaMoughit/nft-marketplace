const messageRepository = require('../repositories/MessageRepository');
const conversationRepository = require('../repositories/ConversationRepository')
const profileRepository = require('../repositories/ProfileRepository')

class ChatService {
    constructor(messageRepository, conversationRepository, profileRepository) {
        this.messageRepository = messageRepository;
        this.conversationRepository = conversationRepository;
        this.profileRepository = profileRepository;
    }

    save(message) {
        this.messageRepository.save({
            body: message.body,
            ConversationId: message.ConversationId,
            ProfileId: message.ProfileId
        })
    }


    findOrCreateConversation(p1Id, p2Id, customOffer) {
        return new Promise(async (resolve, reject) => {
            try {
                if (customOffer === undefined) customOffer = false;
                if (p1Id === p2Id) throw new Error("You can't have a conversation with yourself");
                let participant1 = await this.profileRepository.findByProfileId(p1Id);
                let participant2 = await this.profileRepository.findByProfileId(p2Id);

                let [conversation, created] = await this.conversationRepository.findOrCreate(participant1.id, participant2.id, customOffer);
                resolve(conversation);
            } catch (error) {
                console.log(error);
                const participant2 = await this.profileRepository.findByProfileId(p2Id);
                reject(participant2);
            }
        });
    }

    chatByConversationId(conversationId, currentProfile) {
        return new Promise(async (resolve, reject) => {
            try {
                // Get Names of participants and their conversationId for the aside
                const participantsAndConversationIds = [];
                const conversationsFromDB = await this.conversationRepository.findAllByProfileId(currentProfile.id);
                for (const conversation of conversationsFromDB) {
                    const otherParticipentId = conversation.dataValues.participent1Id === currentProfile.id ?
                        conversation.dataValues.participent2Id : conversation.dataValues.participent1Id;

                    const otherParticipant = await this.profileRepository.findById(otherParticipentId);

                    participantsAndConversationIds.push({
                        conversationId : conversation.dataValues.id,
                        isCustomOffer: conversation.dataValues.isCustomOffer,
                        OtherParticipant : otherParticipant.name
                    })
                }

                if (conversationId === undefined) {
                    return resolve([participantsAndConversationIds, null, null, null])
                }

                // Get the Other Participant profile data
                const otherParticipantFromDB = await this.profileRepository.findOtherParticipantByConversationId(
                    conversationId, currentProfile.id);
                const otherParticipant = otherParticipantFromDB.dataValues;

                // Find the messages of the conversation
                let messages = []
                const messagesFromDB = await this.messageRepository.findAllByConversationId(conversationId);
                for (const message of messagesFromDB) {
                    messages.push(message.dataValues);
                }

                // Find the conversation
                const conversationFromDB = await this.conversationRepository.findById(conversationId);
                const conversation = conversationFromDB.dataValues;

                resolve([participantsAndConversationIds, otherParticipant, messages, conversation])
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }

    deleteConversation(conversationId) {
        return new Promise((resolve, reject) => {
            console.log("conversation id : ", conversationId);
            this.conversationRepository.deleteById(conversationId)
                .then(res => {
                    resolve("sucess");
                })
                .catch(error=> {
                    console.log(error);
                    reject("error");
                })
        })
    }
}

module.exports = new ChatService(messageRepository, conversationRepository, profileRepository);