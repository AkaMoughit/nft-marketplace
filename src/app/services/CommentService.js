const commentRepository = require("../repositories/CommentRepository");
const profileRepository = require("../repositories/ProfileRepository")

class CommentService {
    constructor(commentRepository, profileRepository) {
        this.commentRepository = commentRepository;
        this.profileRepository = profileRepository;
    }

    async save(commentTBR, profileId) {
        return new Promise(async (resolve, reject) => {
            try {
                commentTBR.ProfileId = profileId;
                const savedComment = await this.commentRepository.save(commentTBR);
                let comment = savedComment.dataValues;

                const profile = await this.profileRepository.findById(profileId);
                comment.creator = profile.dataValues;
                
                resolve(comment);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        })
    }
}
module.exports = new CommentService(commentRepository, profileRepository);