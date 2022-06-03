'use strict'

const profileRepository = require("../repositories/ProfileRepository");
const nftRepository = require("../repositories/NftRepository");
const listingRepository = require("../repositories/ListingRepository");
const userRepository = require("../repositories/UserRepository");
const walletRepository = require("../repositories/WalletRepository")
const AuthorDTO = require("../models/dtos/AuthorDTO");
const NftProfileListingDTO = require("../models/dtos/NftCardDTO");
const getDeltaInDHMS = require("../utils/DateHelper");
const bcrypt = require('bcrypt');
const path = require("path");

class ProfileService {
    constructor(profileRepository, nftRepository, listingRepository, userRepository, walletRepository) {
        this.profileRepository = profileRepository;
        this.nftRepository = nftRepository;
        this.listingRepository = listingRepository;
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    findAllAuthors(limit, offset, name=null) {
        return this.profileRepository.findAll(limit, offset, name);
    }

    findByProfileId(profileId) {
        return new Promise(async (resolve, reject) => {
            try {
                let profile = await this.profileRepository.findByProfileId(profileId);
                let wallet = await this.walletRepository.findByProfileId(profile.id);

                if(wallet) {
                    profile.wallet_id = wallet.dataValues.wallet_id;
                }

                let activeListings = await this.listingRepository.findAllActiveListingsByProfilePk(6, 0, null, profile.id);

                let ownedNfts = await this.nftRepository.findAllByOwnerPk(profile.id);

                let ownedNftCards = [];
                for(let ownedNft of ownedNfts) {
                    let isListed = false;
                    if(activeListings.rows.filter(function (el) {return el.token_id === ownedNft.token_id}).length > 0) {
                        isListed = true;
                    }
                    let favoriteCount = await this.nftRepository.findFavoriteCountByTokenId(ownedNft.token_id);
                    let nftCardDTO = new NftProfileListingDTO(ownedNft, profile, undefined, undefined, isListed);
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

    editProfilePic(profilePicFile, profileId) {
        return new Promise (async (resolve, reject) => {
            try {
                if (profilePicFile.mimetype.includes('image')) {
                    let relativePath = profilePicFile.path
                        .split(path.sep)
                        .join(path.posix.sep)
                        .replace('src/client/public/', '');

                    let profile = {
                        picture_url : relativePath
                    }
                    await profileRepository.update(profile, profileId);
                    resolve(relativePath);
                } else {
                    console.log('Profile picture only accepts images');
                    reject('Profile picture only accepts images.');
                }
            } catch(e) {
                console.log(e)
                reject('An error has occured')
            }
        })
    }

    editBannerPic(bannerPicFile, profileId) {
        return new Promise (async (resolve, reject) => {
            try {
                if (bannerPicFile.mimetype.includes('image')) {
                    let relativePath = bannerPicFile.path
                        .split(path.sep)
                        .join(path.posix.sep)
                        .replace('src/client/public/', '');

                    let profile = {
                        banner_url : relativePath
                    }
                    await profileRepository.update(profile, profileId);
                    resolve(relativePath);
                } else {
                    console.log('Banner picture only accepts images');
                    reject('Banner picture only accepts images.');
                }
            } catch(e) {
                console.log(e)
                reject('An error has occurred.')
            }
        })
    }

    editProfile(profileInfo, profileId, userId) {
        return new Promise(async (resolve, reject) => {
            if (profileInfo.password) {
                const hashedPwd = await bcrypt.hash(profileInfo.password, 10);
                let user = {
                    id : userId,
                    password: hashedPwd
                }
                try {
                    await userRepository.update(user);
                } catch (error) {
                    console.log(error);
                    reject("An error has occurred");
                }
            }

            let profile = {
                name: profileInfo.name,
                about: profileInfo.about
            }

            try {
                await profileRepository.update(profile, profileId);
                resolve("Profile edited successfully");
            } catch (error) {
                console.log(error);
                reject("An error has occurred");
            }
        });
    }
}
module.exports = new ProfileService(profileRepository, nftRepository, listingRepository, userRepository, walletRepository);