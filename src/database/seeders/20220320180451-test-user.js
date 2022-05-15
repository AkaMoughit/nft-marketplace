'use strict';


const { faker } = require('@faker-js/faker');
module.exports = {
    async up (queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */

        async function customInsert(tableName, records, options) {
            let ids = [];
            let index = await queryInterface.bulkInsert(tableName, records, options);

            do{
                ids.push(index);
                index++;
            }while(index <= users.length);

            return ids;
        }

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
        }

        function getRandomDouble(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.random() * (max - min) + min; //The maximum is exclusive and the minimum is inclusive
        }

        function generateUsers(number) {
            let users = [];
            for(let index = 1; index < number; index++) {
                users.push({
                    id: index,
                    email: faker.internet.email(),
                    password: faker.internet.password(),
                    phone_number: faker.phone.phoneNumber("+212 6 ## ## ## ##"),
                    createdAt: new Date(),
                    updatedAt: new Date()
                })
            }
            return users;
        }

        function generateProfiles(users) {
            let profiles = [];
            let blockchain_types = ["ETHEREUM"];
            let specialities = ["Digital Art", "Photography", "Music"];


            for(const user of users) {
                let name = faker.name.findName();
                profiles.push({
                    id: user.id,
                    name: name,
                    wallet_id: faker.datatype.uuid(),
                    picture_url: faker.internet.url(),
                    banner_url: faker.internet.url(),
                    acc_creation_date: faker.date.past(),
                    profile_id: "@" + name.replaceAll(" ", "") + "." + faker.datatype.uuid(),
                    blockchain_type: blockchain_types[0],
                    specialize_in: specialities[getRandomInt(0, 3)],
                    birthdate: faker.date.past(50, new Date(2004, 4, 14)),
                    about: faker.lorem.text(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    UserId: user.id
                })
            }
            return profiles;
        }

        function generateCustomOffers(profiles, numberPerProfile) {
            let customOffers = [];
            for(const profile of profiles) {
                for(let index = numberPerProfile * (profile.id - 1) + 1; index <= numberPerProfile * profile.id; index++) {
                    customOffers.push({
                        id: index,
                        title: faker.company.catchPhrase(),
                        body: faker.lorem.text(),
                        value_offered: faker.datatype.number(),
                        creation_date: faker.date.past(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ProfileId: profile.id
                    })
                }
            }
            return customOffers;
        }

        function generateNfts(profiles, customOffers, numberPerProfile) {
            let nfts = [];

            for(const profile of profiles) {

                let ownedCustomOffers = [];
                for(const customOffer of customOffers) {
                    if (customOffer.ProfileId === profile.id) {
                        ownedCustomOffers.push(customOffer);
                    }
                }

                for (let index = numberPerProfile * (profile.id - 1) + 1; index <= numberPerProfile * profile.id; index++) {

                    let randomOwnedCustonOfferIndex = getRandomInt(0, ownedCustomOffers.length - 1);
                    let customOfferExist = getRandomInt(0, 2);

                    nfts.push({
                        id: index,
                        creation_date: faker.date.past(),
                        contract_adress: faker.address.city(0),
                        token_id: faker.datatype.uuid(),
                        description: faker.lorem.text(),
                        name: faker.name.findName(),
                        //blockchain_type: 'ETHEREUM',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        ProfileId: profile.id,
                        // Generate randomness
                        CustomOfferId: customOfferExist === 1 ? ownedCustomOffers[randomOwnedCustonOfferIndex].id : undefined
                    })
                    //console.log(ownedCustomOffers[randomOwnedCustonOfferIndex]);
                    ownedCustomOffers.splice(randomOwnedCustonOfferIndex, 1);
                }

                for(let nft of nfts) {
                    nft.creatorId = profiles[getRandomInt(0, profiles.length)].id;
                }
            }
            return nfts;
        }

        function generateListings(profiles, nfts, number) {
            let listings = [];
            let types = ["NORMAL", "AUCTION"];

            for (let i = 0; i < nfts.length; i++) {
                listings.push({
                    id : i + 1,
                    price : getRandomDouble(0,100).toFixed(2),
                    type : types[getRandomInt(0, 2)],
                    sale_end_date : faker.date.future(),
                    createdAt : new Date(),
                    updatedAt : new Date(),
                    NftId : nfts[i].id,
                    ProfileId : nfts[i].ProfileId
                });
            }
            return listings;
        }

        function generateFavoriteLists(profiles, nfts) {
            let favoriteLists = [];
            for (const profile of profiles) {
                for (let i = getRandomInt(0, nfts.length / 2); i < nfts.length; i += getRandomInt(1, 4)) {
                    favoriteLists.push({
                        favorite_date : new Date(),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        ProfileId : profile.id,
                        NftId : nfts[i].id
                    });
                }
            }
            return favoriteLists;
        }

        function generateActivities(listings) {
            let activities = [];
            let transaction_types = ["PURCHASE","SALE"];
            for (const listing of listings) {
                activities.push({
                    transaction_type : transaction_types[getRandomInt(0, 2)],
                    transaction_date : new Date(),
                    createdAt : new Date(),
                    updatedAt : new Date(),
                    ListingId : listing.id,
                    NftId : listing.NftId,
                    ProfileId : listing.ProfileId
                });
            }
            return activities;
        }

        function generateOffers(profiles, listings) {
            let offers = [];
            for (const listing of listings) {
                for (let i = getRandomInt(0, profiles.length /2); i < profiles.length; i++) {
                    offers.push({
                        value_offered : getRandomDouble(0.10, listing.price),
                        offer_date : new Date(),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        ListingId : listing.id,
                        ProfileId : profiles[i].id
                    });
                }
            }
            return offers;
        }

        function generateComments(customOffers, profiles) {
            let comments = [];
            let j = 1;
            for (const customOffer of customOffers) {
                for (let i = getRandomInt(0, profiles.length /2); i < profiles.length; i++) {
                    comments.push({
                        id : j,
                        send_date : new Date(),
                        body : faker.lorem.paragraph(getRandomInt(1, 6)),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        CustomOfferId : customOffer.id,
                        ProfileId : profiles[i].id,
                        CommentId : null
                    });
                    j++;
                }
            }
            return comments;
        }

        function generateReplies(comments, profiles) {
            let replies = [];
            let j = comments.length + 1;
            for (let i = getRandomInt(0, comments.length /2); i < comments.length; i++) {
                for (let k = getRandomInt(0, profiles.length /2); k < profiles.length; k++) {
                    replies.push({
                        id : j,
                        send_date : new Date(),
                        body : faker.lorem.paragraph(getRandomInt(1, 6)),
                        createdAt : new Date(),
                        updatedAt : new Date(),
                        CustomOfferId : comments[i].CustomOfferId,
                        ProfileId : profiles[k].id,
                        CommentId : comments[i].id
                    });
                    j++;
                }
            }
            // console.log(replies);
            return replies;
        }


        let users = generateUsers(50);
        await customInsert('Users', users, {});

        let profiles = generateProfiles(users);
        await customInsert('Profiles', profiles, {});

        let customOffers = generateCustomOffers(profiles, 3);
        await customInsert('CustomOffers', customOffers, {});

        let nfts = generateNfts(profiles, customOffers, 3);
        await customInsert('Nfts',nfts, {});

        let listings = generateListings(profiles, nfts, 10);
        await queryInterface.bulkInsert('Listings', listings, {});

        let favoriteLists = generateFavoriteLists(profiles, nfts);
        await queryInterface.bulkInsert('FavoriteLists', favoriteLists, {});

        let activities = generateActivities(listings);
        await queryInterface.bulkInsert('Activities', activities, {});

        let offers = generateOffers(profiles, listings);
        await queryInterface.bulkInsert('Offers', offers, {});

        let comments = generateComments(customOffers, profiles);
        await queryInterface.bulkInsert('Comments', comments, {});

        let replies = generateReplies(comments, profiles);
        await queryInterface.bulkInsert('Comments', replies, {});
    },

    async down (queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete('Comments', null, {});
        await queryInterface.bulkDelete('Offers', null, {});
        await queryInterface.bulkDelete('Activities', null, {});
        await queryInterface.bulkDelete('FavoriteLists', null, {});
        await queryInterface.bulkDelete('Listings', null, {});
        await queryInterface.bulkDelete('Nfts', null, {});
        await queryInterface.bulkDelete('OfferAttachments', null, {});
        await queryInterface.bulkDelete('CustomOffers', null, {});
        await queryInterface.bulkDelete('Profiles', null, {});
        await queryInterface.bulkDelete('Users', null, {});
    }
};