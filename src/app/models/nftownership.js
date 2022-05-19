'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NftOwnership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NftOwnership.belongsTo(models.Nft);
      NftOwnership.belongsTo(models.Profile);
    }
  }
  NftOwnership.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    price: DataTypes.DOUBLE,
    transaction_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'NftOwnership',
  });
  return NftOwnership;
};