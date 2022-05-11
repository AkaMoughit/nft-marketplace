const nftRepository = require("../repositories/NftRepository");

class NftService {
    constructor(nftRepository) {
        this.nftRepository = nftRepository;
    }

    listAll() {
        return this.nftRepository.listAll();
    }

    findNftCardByTokenId(tokenId) {
        return this.nftRepository.findNftCardByTokenId(tokenId);
    }

    findAllNftCards() {
        return this.nftRepository.findAllNftCards();
    }
}

module.exports = new NftService(nftRepository);