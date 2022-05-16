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

    findAllAuthors(limit, offset, name=null) {
        return this.profileRepository.findAll(limit, offset, name);
    }

    findByProfileId(profileId) {
        return new Promise(async (resolve, reject) => {
            try {
                let profileAbout = await this.profileRepository.findAboutByProfileId(profileId);
                if ( profileAbout == null ) {
                    reject("Profile not found");
                }

                let onSaleListings = await this.profileRepository.findOnSaleByProfile(profileAbout);

                let listOnSaleNftCards = [];
                for (let onSaleListing of onSaleListings) {

                    let nftCardDTO = new NftProfileListingDTO(onSaleListing.Nft, profileAbout, onSaleListing);
                    let deltaInDHMS = getDeltaInDHMS(new Date(nftCardDTO.sale_end_date), new Date());
                    nftCardDTO.sale_end_date = deltaInDHMS;

                    let favoriteCount = await this.nftRepository.findFavoriteCountByTokenId(nftCardDTO.token_id);
                    nftCardDTO.favoriteCount = favoriteCount;

                    listOnSaleNftCards.push(nftCardDTO);
                }

                let ownedNfts = await this.nftRepository.findByOwnerProfileId(profileAbout.id);

                let listOwnedNfts = [];
                for(let ownedNft of ownedNfts) {
                    let favoriteCount = await this.nftRepository.findFavoriteCountByTokenId(ownedNft.token_id);
                    let nftCardDTO = new NftProfileListingDTO(ownedNft, profileAbout);
                    nftCardDTO.favoriteCount = favoriteCount;
                    listOwnedNfts.push(nftCardDTO);
                }

                let createdNfts = await this.nftRepository.findByCreatedProfileId(profileAbout.id);

                let listCreatedNfts = [];
                for(let createdNft of createdNfts) {
                    let owner = await this.profileRepository.findById(createdNft.ProfileId);
                    let favoriteCount = await this.nftRepository.findFavoriteCountByTokenId(createdNft.token_id);
                    let nftCardDTO = new NftProfileListingDTO(createdNft, owner);
                    nftCardDTO.favoriteCount = favoriteCount;
                    listCreatedNfts.push(nftCardDTO);
                }

                resolve(new AuthorDTO(profileAbout, listOnSaleNftCards, listOwnedNfts, listCreatedNfts));
            } catch (err) {
               reject("Profile Not found");
            }
        });
    }
}
module.exports = new ProfileService(profileRepository, nftRepository);