const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "Users", deps: []
 * createTable() => "Profiles", deps: [Users]
 * createTable() => "CustomOffers", deps: [Profiles]
 * createTable() => "Nfts", deps: [CustomOffers, Profiles]
 * createTable() => "Listings", deps: [Nfts, Profiles]
 * createTable() => "FavoriteLists", deps: [Nfts, Profiles]
 * createTable() => "NftAttachments", deps: [Nfts]
 * createTable() => "Activities", deps: [Listings, Nfts, Profiles]
 * createTable() => "OfferAttachments", deps: [CustomOffers]
 * createTable() => "Offers", deps: [Listings, Nfts, Profiles]
 *
 */

const info = {
  revision: 1,
  name: "db-create",
  created: "2022-03-21T18:38:51.395Z",
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
        email: { type: Sequelize.STRING, field: "email" },
        password: { type: Sequelize.STRING, field: "password" },
        phone_number: { type: Sequelize.STRING, field: "phone_number" },
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
        name: { type: Sequelize.STRING, field: "name" },
        wallet_id: { type: Sequelize.STRING, field: "wallet_id" },
        picture_url: { type: Sequelize.STRING, field: "picture_url" },
        banner_url: { type: Sequelize.STRING, field: "banner_url" },
        acc_creation_date: { type: Sequelize.DATE, field: "acc_creation_date" },
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
        title: { type: Sequelize.STRING, field: "title" },
        body: { type: Sequelize.TEXT, field: "body" },
        value_offered: { type: Sequelize.DOUBLE, field: "value_offered" },
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
      "Nfts",
      {
        id: {
          type: Sequelize.INTEGER,
          field: "id",
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        creation_date: { type: Sequelize.DATE, field: "creation_date" },
        contract_adress: { type: Sequelize.STRING, field: "contract_adress" },
        token_id: { type: Sequelize.STRING, field: "token_id" },
        description: { type: Sequelize.TEXT, field: "description" },
        name: { type: Sequelize.STRING, field: "name" },
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
        price: { type: Sequelize.DOUBLE, field: "price" },
        type: { type: Sequelize.STRING, field: "type" },
        sale_end_date: { type: Sequelize.DATE, field: "sale_end_date" },
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
        NftId: {
          type: Sequelize.INTEGER,
          field: "NftId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Nfts", key: "id" },
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
      "NftAttachments",
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
      "Activities",
      {
        transaction_type: { type: Sequelize.STRING, field: "transaction_type" },
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
        ListingId: {
          type: Sequelize.INTEGER,
          field: "ListingId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Listings", key: "id" },
          allowNull: true,
        },
        NftId: {
          type: Sequelize.INTEGER,
          field: "NftId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Nfts", key: "id" },
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
      "OfferAttachments",
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
        CustomOfferId: {
          type: Sequelize.INTEGER,
          field: "CustomOfferId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "CustomOffers", key: "id" },
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
        value_offered: { type: Sequelize.DOUBLE, field: "value_offered" },
        offer_date: { type: Sequelize.DATE, field: "offer_date" },
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
          field: "ListingId",
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
          references: { model: "Listings", key: "id" },
          allowNull: true,
        },
        NftId: {
          type: Sequelize.INTEGER,
          field: "NftId",
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
          references: { model: "Nfts", key: "id" },
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
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["Activities", { transaction }],
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
    params: ["Nfts", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["NftAttachments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Offers", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["OfferAttachments", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Profiles", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["Users", { transaction }],
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
