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

    findAllNftCardsOrderedByFavoriteCount(limit, offset) {
        return this.nftRepository.findAllNftCardsOrderedByFavoriteCount(limit, offset);
    }
}
module.exports = new NftService(nftRepository);