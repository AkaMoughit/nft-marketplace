'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TicketAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TicketAttachment.belongsTo(models.Ticket);
    }
  }
  TicketAttachment.init({
    name: DataTypes.STRING,
    attachment_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TicketAttachment',
  });
  return TicketAttachment;
};