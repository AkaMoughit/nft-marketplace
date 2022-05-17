const listingRepository = require("../repositories/ListingRepository");

class ListingService {
    constructor(listingRepository) {
        this.listingRepository = listingRepository;
    }

    listAll() {
        return this.listingRepository.listAll();
    }

    findNftCardByTokenId(tokenId) {
        return this.listingRepository.findNftCardByTokenId(tokenId);

    }

    findAllActiveListings(limit, offset, name=null) {
        return this.listingRepository.findAllActiveListings(limit, offset, name);
    }

    findByNftTokenId(tokenId) {
        return this.listingRepository.findByNftTokenId(tokenId);
    }
}
module.exports = new ListingService(listingRepository);