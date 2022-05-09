'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NftCollection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NftCollection.belongsToMany(models.Profile, { through: 'CollectionFavoriteList' });
      NftCollection.belongsTo(models.Profile);
      NftCollection.hasMany(models.Nft);
    }
  }
  NftCollection.init({
    name: DataTypes.STRING,
    creation_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'NftCollection',
  });
  return NftCollection;
};