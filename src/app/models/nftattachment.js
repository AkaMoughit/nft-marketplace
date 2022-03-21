'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NftAttachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NftAttachment.belongsTo(models.Nft);
    }
  }
  NftAttachment.init({
    name: DataTypes.STRING,
    attachment_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'NftAttachment',
  });
  return NftAttachment;
};