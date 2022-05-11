const BaseRepository = require("./BaseRepository");
const Nft = require("../models").Nft;

class NftRepository extends BaseRepository {
    constructor(Nft) {
        super(Nft);
    }

    listAll() {
        return this.model.findAll();
    }

    findByTokenId(tokenId) {
        return this.model.findOne({ where: { token_id: tokenId }});
    }
}

module.exports = new NftRepository(Nft);