const profileRepository = require("../repositories/ProfileRepository");
const nftRepository = require("../repositories/NftRepository");
const AuthorDTO = require("../dtos/AuthorDTO");
const NftProfileListingDTO = require("../dtos/NftCardDTO");
const getDeltaInDHMS = require("../utils/DateHelper");

class ProfileService {
    constructor(profileRepository, nftRepository) {
        this.profileRepository = profileRepository;
        this.nftRepository = nftRepository;
    }

    findByProfileId(profileId) {
        return new Promise(async (resolve, reject) => {
            try {
                let profileAbout = await this.profileRepository.findAboutByProfileId(profileId);
                if ( profileAbout == null ) {
                    reject("Profile not found");
                }
                let onSaleListings = await this.profileRepository.findOnSaleByProfile(profileAbout);

                let listNftCards = [];
                for (let onSaleListing of onSaleListings) {

                    let nftCardDTO = new NftProfileListingDTO(onSaleListing.Nft, profileAbout, onSaleListing);
                    let deltaInDHMS = getDeltaInDHMS(new Date(nftCardDTO.sale_end_date), new Date());
                    nftCardDTO.sale_end_date = deltaInDHMS;

                    let favoriteCount = await this.nftRepository.findFavoriteCountByTokenId(nftCardDTO.token_id);
                    nftCardDTO.favoriteCount = favoriteCount;

                    listNftCards.push(nftCardDTO);
                }

                resolve(new AuthorDTO(profileAbout, listNftCards));
            } catch (err) {
               reject("Profile Not found");
            }
        });
    }
}
module.exports = new ProfileService(profileRepository, nftRepository);