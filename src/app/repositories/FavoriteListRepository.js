const BaseRepository = require("./BaseRepository");
const FavoriteList = require("../models").FavoriteList;

class FavoriteListRepository extends BaseRepository {
    constructor(FavoriteList) {
        super(FavoriteList);
    }

    async findByProfileIdAndNftId(profileId, nftId) {
        return this.model.findOne({
            where:{
                ProfileId: profileId,
                nftId: nftId
            }
        })
    }

    async add(profileId, nftId) {
        const favoriteList = {
            createdAt: new Date(),
            updatedAt: new Date(),
            ProfileId: profileId,
            NftId: nftId
        }
        return this.model.create(favoriteList);
    }

    async deleteByProfileIdAndNftId(profileId, nftId) {
        return this.model.destroy({
            where: {
                ProfileId: profileId,
                NftId: nftId
            }
        })
    }

    async countByNftId(nftId) {
        return this.model.count({
            where: {
                NftId: nftId
            }
        });
    }

}

module.exports = new FavoriteListRepository(FavoriteList);