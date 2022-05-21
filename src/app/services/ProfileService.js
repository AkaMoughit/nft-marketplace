'use strict'

const profileRepository = require("../repositories/ProfileRepository");
const nftRepository = require("../repositories/NftRepository");
const listingRepository = require("../repositories/ListingRepository");
const AuthorDTO = require("../dtos/AuthorDTO");
const NftProfileListingDTO = require("../dtos/NftCardDTO");
const getDeltaInDHMS = require("../utils/DateHelper");

class ProfileService {
    constructor(profileRepository, nftRepository, listingRepository) {
        this.profileRepository = profileRepository;
        this.nftRepository = nftRepository;
        this.listingRepository = listingRepository;
    }

    findAllAuthors(limit, offset, name=null) {
        return this.profileRepository.findAll(limit, offset, name);
    }

    findByProfileId(profileId) {
        return new Promise(async (resolve, reject) => {
            try {
                let profile = await this.profileRepository.findByProfileId(profileId);

                let activeListings = await this.listingRepository.findAllActiveListingsByProfilePk(6, 0, null, profile.id);

                let ownedNfts = await this.nftRepository.findAllByOwnerPk(profile.id);

                let ownedNftCards = [];
                for(let ownedNft of ownedNfts) {
                    let favoriteCount = await this.nftRepository.findFavoriteCountByTokenId(ownedNft.token_id);
                    let nftCardDTO = new NftProfileListingDTO(ownedNft, profile);
                    nftCardDTO.favoriteCount = favoriteCount;
                    ownedNftCards.push(nftCardDTO);
                }

                let createdNfts = await this.nftRepository.findByCreatorPk(profile.id);

                let listCreatedNfts = [];
                for(let createdNft of createdNfts) {
                    let owner = await this.profileRepository.findByOwnedNftPk(createdNft.id);
                    let favoriteCount = await this.nftRepository.findFavoriteCountByTokenId(createdNft.token_id);
                    let nftCardDTO = new NftProfileListingDTO(createdNft, owner);
                    nftCardDTO.favoriteCount = favoriteCount;
                    listCreatedNfts.push(nftCardDTO);
                }

                let authorDTO = new AuthorDTO(profile, activeListings, ownedNftCards, listCreatedNfts);
                resolve(authorDTO);
            } catch (err) {
                console.log(err);
               reject("Error fetching user");
            }
        });
    }
}
module.exports = new ProfileService(profileRepository, nftRepository, listingRepository);