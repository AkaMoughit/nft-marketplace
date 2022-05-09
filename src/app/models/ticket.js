'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Ticket.belongsTo(models.Profile);
      Ticket.hasMany(models.TicketAttachment);
    }
  }
  Ticket.init({
    ticket_number: DataTypes.STRING,
    title: DataTypes.STRING,
    subject: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};