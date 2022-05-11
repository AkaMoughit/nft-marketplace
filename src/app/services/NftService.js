const nftRepository = require("../repositories/NftRepository");
const profileRepository = require("../repositories/ProfileRepository");
const NftProfileListingDTO = require("../dtos/NftProfileListingDTO");

class NftService {
    constructor(nftRepository, profileRepository) {
        this.nftRepository = nftRepository;
        this.profileRepository = profileRepository;
    }

    listAll() {
        return this.nftRepository.listAll();
    }

    findByTokenId(tokenId) {
        return new Promise((resolve, reject) => {
            this.nftRepository.findByTokenId(tokenId)
                .then(nft => {
                    this.profileRepository.findByPk(nft.ProfileId)
                        .then(profile => {
                            let nftDTO = new NftProfileListingDTO(nft, profile);
                            resolve(nftDTO);
                        })
                        .catch(err => {
                            reject(err);
                        });
                }).catch(err => {
                    reject(err);
            });
        });

    }
}

module.exports = new NftService(nftRepository, profileRepository);