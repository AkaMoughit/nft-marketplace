const BaseRepository = require("./BaseRepository");
const Nft = require("../models").Nft;

class NftRepository extends BaseRepository {
    constructor(Nft) {
        super(Nft);
    }

    listAll() {
        return this.model.findAll();
    }
}

module.exports = new NftRepository(Nft);