const nftRepository = require("../repositories/NftRepository");

class NftService {
    constructor(nftRepository) {
        this.repository = nftRepository;
    }

    listAll() {
        return this.repository.listAll();
    }
}

module.exports = new NftService(nftRepository);