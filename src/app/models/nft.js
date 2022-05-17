'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Nft.belongsTo(models.CustomOffer);
      Nft.belongsTo(models.Profile, {
        as: 'Creator'
      });
      Nft.belongsTo(models.NftCollection);
      Nft.hasMany(models.NftAttachment);
      Nft.hasMany(models.Listing);
      Nft.hasMany(models.FavoriteList);
      Nft.belongsToMany(models.Profile, { through: 'FavoriteList' });
    }
  }
  Nft.init({
    creation_date: DataTypes.DATE,
    contract_adress: DataTypes.STRING,
    token_id: DataTypes.STRING,
    description: DataTypes.TEXT,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Nft',
  });
  return Nft;
};