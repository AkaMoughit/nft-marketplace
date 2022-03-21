'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Profile.belongsTo(models.User);
      Profile.hasMany(models.CustomOffer);
      Profile.hasMany(models.Nft);
      Profile.hasMany(models.Listing);
      Profile.belongsToMany(models.Nft, { through: 'FavoriteList' });
      Profile.belongsToMany(models.Nft, { through: 'Offer' });
      Profile.belongsToMany(models.Nft, { through: 'Activity' });
    }
  }
  Profile.init({
    name: DataTypes.STRING,
    wallet_id: DataTypes.STRING,
    picture_url: DataTypes.STRING,
    banner_url: DataTypes.STRING,
    acc_creation_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};