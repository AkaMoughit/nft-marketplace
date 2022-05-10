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
      for(const user of users) {
        profiles.push({
          id: user.id,
          name: faker.name.findName(),
          wallet_id: faker.datatype.uuid(),
          picture_url: faker.internet.url(),
          banner_url: faker.internet.url(),
          acc_creation_date: faker.date.past(),
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

          function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
          }

          let randomOwnedCustonOfferIndex = getRandomInt(0, ownedCustomOffers.length - 1);
          let customOfferExist = getRandomInt(0, 2);

          nfts.push({
            id: index,
            creation_date: faker.date.past(),
            contract_adress: faker.address.city(0),
            token_id: faker.datatype.uuid(),
            description: faker.lorem.text(),
            name: faker.name.findName(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ProfileId: profile.id,
            CustomOfferId: customOfferExist === 1 ? ownedCustomOffers[randomOwnedCustonOfferIndex].id : undefined
          })
          //console.log(ownedCustomOffers[randomOwnedCustonOfferIndex]);
          ownedCustomOffers.splice(randomOwnedCustonOfferIndex, 1);
        }
      }
      return nfts;
    }

    let users = generateUsers(10);
    await customInsert('Users', users, {});

    let profiles = generateProfiles(users);
    await customInsert('Profiles', profiles, {});

    let customOffers = generateCustomOffers(profiles, 3);
    await customInsert('CustomOffers', customOffers, {});

    let nfts = generateNfts(profiles, customOffers, 2);
    await customInsert('Nfts',nfts, {});

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('Nfts', null, {});
    await queryInterface.bulkDelete('OfferAttachments', null, {});
    await queryInterface.bulkDelete('CustomOffers', null, {});
    await queryInterface.bulkDelete('Profiles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
