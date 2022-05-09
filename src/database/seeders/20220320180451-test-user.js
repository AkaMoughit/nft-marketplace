'use strict';

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
      let userIds = [];
      let index = await queryInterface.bulkInsert(tableName, records, options);

      do{
        userIds.push(index);
        index++;
      }while(index <= users.length);

      return userIds;
    }

    const users = [
      {
        email: 'email@email.com',
        password: 'JoeMama',
        phone_number: '0646464644',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        email: 'email2@email.com',
        password: 'DenyWordhehe',
        phone_number: '0646464644',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    let userIds = [];
    userIds = await customInsert('Users', users, {});


    let profilesList = [];
    for (const userId of userIds) {
      let profiles = [
        {
          name: 'profile1',
          wallet_id: 'ididididiidididididiididid',
          picture_url: 'sdjofhosdjf.com/dfsdf',
          banner_url: 'sdjofhosdjf.com/sdklfsdj',
          acc_creation_date: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          UserId: userId
        }
      ];
      // profilesList.push(await customInsert('Profiles', profiles, {}));
      await customInsert('Profiles', profiles, {})
    }

    // let customOffersList = [];
    // for (const profileIds of profilesList) {
    //   for (const profileId of profileIds) {
    //     let customOffers = [
    //       {
    //         id: profileId,
    //         title: 'title1',
    //         body: 'body1',
    //         value_offered: 354.12,
    //         creation_date: '1999-12-12',
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         ProfileId: profileId
    //       },
    //       {
    //         id: profileId,
    //         title: 'title2',
    //         body: 'body2',
    //         value_offered: 954.12,
    //         creation_date: '2009-12-12',
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         ProfileId: profileId
    //       }
    //     ];
    //     customOffersList.push(await customInsert('CustomOffers', customOffers, {}));
    //   }
    // }
    //
    // for (const customOfferIds of customOffersList) {
    //   for (const customOfferId of customOfferIds) {
    //     let attachments = [
    //       {
    //         name: 'name1',
    //         attachment_url: 'dsoudsfuohsd@fds.com',
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         CustomOfferId: customOfferId
    //       },
    //       {
    //         name: 'name2',
    //         attachment_url: 'ddsfuohsd@fds.fr',
    //         createdAt: new Date(),
    //         updatedAt: new Date(),
    //         CustomOfferId: customOfferId
    //       }
    //     ];
    //     await customInsert('CustomOffers', attachments, {});
    //   }
    // }

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete('OfferAttachments', null, {});
    await queryInterface.bulkDelete('CustomOffers', null, {});
    await queryInterface.bulkDelete('Profiles', null, {});
    await queryInterface.bulkDelete('Users', null, {});
  }
};
