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
      //Profile.hasMany(models.Nft);
      Profile.hasMany(models.Listing);
      Profile.hasMany(models.NftCollection);
      Profile.hasMany(models.Ticket);
      Profile.hasMany(models.Comment);
      Profile.hasMany(models.FavoriteList)
      Profile.belongsToMany(models.Nft, { through: 'FavoriteList' });
      Profile.belongsToMany(models.Listing, { through: 'Offer' });
      Profile.belongsToMany(models.Nft, { through: 'Activity' });
      Profile.belongsToMany(models.NftCollection, { through: 'CollectionFavoriteList' });
    }
  }
  Profile.init({
    name: DataTypes.STRING,
    wallet_id: DataTypes.STRING,
    picture_url: DataTypes.STRING,
    banner_url: DataTypes.STRING,
    acc_creation_date: DataTypes.DATE,
    profile_id: DataTypes.STRING,
    blockchain_type: DataTypes.STRING,
    specialize_in: DataTypes.STRING,
    birthdate: DataTypes.DATE,
    about: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};