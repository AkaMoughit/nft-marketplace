const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * addColumn(participent2Id) => "Conversations"
 * addColumn(participent1Id) => "Conversations"
 *
 */

const info = {
  revision: 5,
  name: "full_migration",
  created: "2022-05-09T12:59:52.841Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "addColumn",
    params: [
      "Conversations",
      "participent2Id",
      {
        type: Sequelize.INTEGER,
        field: "participent2Id",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Profiles", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
  {
    fn: "addColumn",
    params: [
      "Conversations",
      "participent1Id",
      {
        type: Sequelize.INTEGER,
        field: "participent1Id",
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        references: { model: "Profiles", key: "id" },
        allowNull: true,
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "removeColumn",
    params: ["Conversations", "participent2Id", { transaction }],
  },
  {
    fn: "removeColumn",
    params: ["Conversations", "participent1Id", { transaction }],
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
