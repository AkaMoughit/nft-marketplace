const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Users", deps: []
 * createTable() => "Profiles", deps: [Users]
 * createTable() => "CustomOffers", deps: [Profiles]
 * createTable() => "NftCollections", deps: [Profiles]
 * createTable() => "CollectionFavoriteLists", deps: [NftCollections, Profiles]
 * createTable() => "Conversations", deps: [Profiles, Profiles, Profiles]
 * createTable() => "Nfts", deps: [CustomOffers, Profiles, NftCollections]
 * createTable() => "Comments", deps: [CustomOffers, Profiles, Comments]
 * createTable() => "Attachments", deps: [CustomOffers, Nfts]
 * createTable() => "FavoriteLists", deps: [Profiles, Nfts]
 * createTable() => "Listings", deps: [Nfts, Profiles, Profiles]
 * createTable() => "Messages", deps: [Conversations, Listings, Profiles]
 * createTable() => "NftOwnerships", deps: [Nfts, Profiles, Profiles]
 * createTable() => "Offers", deps: [Listings, Profiles]
 * createTable() => "Tickets", deps: [Profiles]
 * createTable() => "TicketAttachments", deps: [Tickets]
 * createTable() => "UserVerifications", deps: [Users]
 * createTable() => "Wallets", deps: [Profiles]
 *
 */

const info = {
  revision: 1,
  name: "noname",
  created: "2022-06-05T16:12:34.694Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "Users",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          field: "email",
          unique: true,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          field: "password",
          allowNull: false,
        },
        phone_number: {
          type: Sequelize.STRING,
          field: "phone_number",
          unique: true,
          allowNull: false,
        },
        isVerified: {
          type: Sequelize.BOOLEAN,
          field: "isVerified",
          allowNull: false,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Profiles",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        wallet_id: {
          type: Sequelize.STRING,
          field: "wallet_id",
          unique: true,
          allowNull: true,
        },
        picture_url: {
          type: Sequelize.STRING,
          field: "picture_url",
          allowNull: true,
        },
        banner_url: {
          type: Sequelize.STRING,
          field: "banner_url",
          allowNull: true,
        },
        acc_creation_date: {
          type: Sequelize.DATE,
          field: "acc_creation_date",
          allowNull: false,
        },
        profile_id: {
          type: Sequelize.STRING,
          field: "profile_id",
          unique: true,
          allowNull: false,
        },
        blockchain_type: {
          type: Sequelize.STRING,
          field: "blockchain_type",
          allowNull: false,
        },
        specialize_in: {
          type: Sequelize.STRING,
          field: "specialize_in",
          allowNull: false,
        },
        birthdate: {
          type: Sequelize.DATE,
          field: "birthdate",
          allowNull: false,
        },
        about: { type: Sequelize.TEXT, field: "about" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        UserId: {
          type: Sequelize.INTEGER,
          field: "UserId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "CustomOffers",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: false },
        body: { type: Sequelize.TEXT, field: "body", allowNull: false },
        value_offered: {
          type: Sequelize.DOUBLE,
          field: "value_offered",
          allowNull: false,
        },
        creation_date: {
          type: Sequelize.DATE,
          field: "creation_date",
          allowNull: false,
        },
        attachment_url: {
          type: Sequelize.STRING,
          field: "attachment_url",
          allowNull: true,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "NftCollections",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name" },
        creation_date: { type: Sequelize.DATE, field: "creation_date" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "CollectionFavoriteLists",
      {
        favorite_date: { type: Sequelize.DATE, field: "favorite_date" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        NftCollectionId: {
          type: Sequelize.INTEGER,
          field: "NftCollectionId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "NftCollections", key: "id" },
          primaryKey: true,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Profiles", key: "id" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Conversations",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        creation_date: { type: Sequelize.DATE, field: "creation_date" },
        isCustomOffer: {
          type: Sequelize.BOOLEAN,
          field: "isCustomOffer",
          allowNull: false,
          defaultValue: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        participent1Id: {
          type: Sequelize.INTEGER,
          field: "participent1Id",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
        participent2Id: {
          type: Sequelize.INTEGER,
          field: "participent2Id",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
        initiator: {
          type: Sequelize.INTEGER,
          field: "initiator",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          name: "initiator",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Nfts",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        creation_date: {
          type: Sequelize.DATE,
          field: "creation_date",
          allowNull: false,
        },
        contract_adress: {
          type: Sequelize.STRING,
          field: "contract_adress",
          unique: false,
          allowNull: false,
        },
        token_id: {
          type: Sequelize.STRING,
          field: "token_id",
          unique: true,
          allowNull: false,
        },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name", allowNull: false },
        uri: { type: Sequelize.STRING, field: "uri", allowNull: false },
        data_url: {
          type: Sequelize.STRING,
          field: "data_url",
          allowNull: false,
        },
        category: {
          type: Sequelize.STRING,
          field: "category",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        CustomOfferId: {
          type: Sequelize.INTEGER,
          field: "CustomOfferId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "CustomOffers", key: "id" },
          allowNull: true,
        },
        CreatorId: {
          type: Sequelize.INTEGER,
          field: "CreatorId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          name: "CreatorId",
          allowNull: true,
        },
        NftCollectionId: {
          type: Sequelize.INTEGER,
          field: "NftCollectionId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "NftCollections", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Comments",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        send_date: { type: Sequelize.DATE, field: "send_date" },
        body: { type: Sequelize.TEXT, field: "body" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        CustomOfferId: {
          type: Sequelize.INTEGER,
          field: "CustomOfferId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "CustomOffers", key: "id" },
          allowNull: true,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
        CommentId: {
          type: Sequelize.INTEGER,
          field: "CommentId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Comments", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Attachments",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        reference_table: {
          type: Sequelize.STRING,
          field: "reference_table",
          allowNull: false,
        },
        attachment_url: {
          type: Sequelize.STRING,
          field: "attachment_url",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        CustomOfferId: {
          type: Sequelize.INTEGER,
          field: "CustomOfferId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "CustomOffers", key: "id" },
          allowNull: true,
        },
        NftId: {
          type: Sequelize.INTEGER,
          field: "NftId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Nfts", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "FavoriteLists",
      {
        favorite_date: { type: Sequelize.STRING, field: "favorite_date" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          unique: "FavoriteLists_ProfileId_NftId_unique",
          primaryKey: true,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "Profiles", key: "id" },
          name: "ProfileId",
          allowNull: false,
        },
        NftId: {
          type: Sequelize.INTEGER,
          unique: "FavoriteLists_ProfileId_NftId_unique",
          primaryKey: true,
          field: "NftId",
          onUpdate: "CASCADE",
          onDelete: "NO ACTION",
          references: { model: "Nfts", key: "id" },
          name: "NftId",
          allowNull: false,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Listings",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        price: { type: Sequelize.DOUBLE, field: "price", allowNull: false },
        type: { type: Sequelize.STRING, field: "type", allowNull: false },
        sale_end_date: { type: Sequelize.DATE, field: "sale_end_date" },
        transaction_date: { type: Sequelize.DATE, field: "transaction_date" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        NftId: {
          type: Sequelize.INTEGER,
          field: "NftId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Nfts", key: "id" },
          allowNull: true,
        },
        SellerId: {
          type: Sequelize.INTEGER,
          field: "SellerId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
        BuyerId: {
          type: Sequelize.INTEGER,
          field: "BuyerId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Messages",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        send_date: {
          type: Sequelize.DATE,
          field: "send_date",
          allowNull: false,
        },
        body: { type: Sequelize.TEXT, field: "body", allowNull: false },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        ConversationId: {
          type: Sequelize.INTEGER,
          field: "ConversationId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Conversations", key: "id" },
          allowNull: true,
        },
        ListingId: {
          type: Sequelize.INTEGER,
          field: "ListingId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Listings", key: "id" },
          allowNull: true,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "NftOwnerships",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          primaryKey: true,
          autoIncrement: true,
        },
        price: { type: Sequelize.DOUBLE, field: "price" },
        transaction_date: { type: Sequelize.DATE, field: "transaction_date" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        NftId: {
          type: Sequelize.INTEGER,
          field: "NftId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Nfts", key: "id" },
          allowNull: true,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
        OwnerId: {
          type: Sequelize.INTEGER,
          field: "OwnerId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          name: "OwnerId",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Offers",
      {
        value_offered: {
          type: Sequelize.DOUBLE,
          field: "value_offered",
          allowNull: false,
        },
        offer_date: {
          type: Sequelize.DATE,
          field: "offer_date",
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        ListingId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          field: "ListingId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Listings", key: "id" },
          primaryKey: true,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Profiles", key: "id" },
          primaryKey: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Tickets",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        ticket_number: { type: Sequelize.STRING, field: "ticket_number" },
        title: { type: Sequelize.STRING, field: "title" },
        subject: { type: Sequelize.STRING, field: "subject" },
        body: { type: Sequelize.TEXT, field: "body" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "TicketAttachments",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: { type: Sequelize.STRING, field: "name" },
        attachment_url: { type: Sequelize.STRING, field: "attachment_url" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        TicketId: {
          type: Sequelize.INTEGER,
          field: "TicketId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Tickets", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "UserVerifications",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        verificationCode: { type: Sequelize.STRING, field: "verificationCode" },
        expirationDate: { type: Sequelize.DATE, field: "expirationDate" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        UserId: {
          type: Sequelize.INTEGER,
          field: "UserId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Users", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "Wallets",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        wallet_id: { type: Sequelize.STRING, field: "wallet_id" },
        createdAt: {
          type: Sequelize.DATE,
          field: "createdAt",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updatedAt",
          allowNull: false,
        },
        ProfileId: {
          type: Sequelize.INTEGER,
          field: "ProfileId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Profiles", key: "id" },
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Attachments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["CollectionFavoriteLists", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Comments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Conversations", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["CustomOffers", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["FavoriteLists", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Listings", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Messages", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Nfts", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["NftCollections", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["NftOwnerships", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Offers", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Profiles", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Tickets", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["TicketAttachments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Users", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["UserVerifications", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Wallets", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
