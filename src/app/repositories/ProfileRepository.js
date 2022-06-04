const BaseRepository = require("./BaseRepository");
const models = require("../models");
const Profile = require("../models").Profile;
const Listing = require("../models").Listing;
const Nft = require("../models").Nft;
const Conversation = require("../models").Conversation;
const NftOwnership = require("../models").NftOwnership

class ProfileRepository extends BaseRepository {
    constructor(Profile, Listing, Nft, NftOwnership, conversation) {
        super(Profile);
        this.listingModel = Listing;
        this.nftModel = Nft;
        this.nftOwnershipModel = NftOwnership;
        this.conversation = conversation;
    }

    findByOwnedNftPk(ownNftPk) {
        return this.model.findOne({
            include: [
                {
                    model: this.nftOwnershipModel,
                    as: 'Owner',
                    where: {
                        NftId: ownNftPk
                    }
                }
            ]
        });
    }

    findAll(limit, offset, name) {
        return this.model.findAndCountAll({
            limit: limit,
            offset: offset,
            where: {
                name: {
                    [models.Sequelize.Op.like]: name==null?"%":"%"+name+"%"
                }
            }
        });
    }

    findByProfileId(profileId) {
        return this.model.findOne({
            where: {
                profile_id: profileId
            }
        });
    }

    findByUserId(userId) {
        return this.model.findOne({
            where: {
                UserId : userId
            }
        });
    }

    findById(id) {
        return this.model.findOne({
            where: {
                id : id
            }
        });
    }

    findOtherParticipantByConversationId(conversationId, currentProfileId) {
        return new Promise(async (resolve, reject) => {
            try {
                const conversationFromDB = await this.conversation.findOne({
                    where: {
                        id : conversationId
                    }
                })
                const conversation = conversationFromDB.dataValues;

                const otherParticipantId = conversation.participent1Id === currentProfileId ?
                    conversation.participent2Id : conversation.participent1Id;

                resolve(this.findById(otherParticipantId))
            } catch (e) {
                console.log(e);
                reject(e);
            }
        })
    }

    save(profile, transaction) {
        return this.model.findOrCreate({
            where: {
                profile_id : profile.profile_id,
            },
            defaults: {
                name : profile.name,
                acc_creation_date : new Date(),
                blockchain_type : "ETHEREUM",
                specialize_in : profile.specialize_in,
                birthdate : profile.birthdate,
                createdAt : new Date(),
                updatedAt : new Date(),
                profile_id : profile.profile_id,
                UserId : profile.UserId
            },
            transaction: transaction
        });
    }

    update(profile, id) {
        return this.model.update(
            profile,
            {
                where: {
                    id : id,
                },
                individualHooks: true
            }
        );
    }

}

module.exports = new ProfileRepository(Profile, Listing, Nft, NftOwnership, Conversation);