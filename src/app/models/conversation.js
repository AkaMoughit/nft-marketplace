'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Conversation.hasMany(models.Message);
      Conversation.belongsTo(models.Profile, { foreignKey : 'participent1Id' });
      Conversation.belongsTo(models.Profile, { foreignKey : 'participent2Id' });
      Conversation.belongsTo(models.Profile, { foreignKey : {name: 'initiator', allowNull: true} });
    }
  }
  Conversation.init({
    creation_date: DataTypes.DATE,
    isCustomOffer : {
      type : DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      validate: {
        notNull: true
      }
    }
  }, {
    sequelize,
    modelName: 'Conversation',
  });
  return Conversation;
};