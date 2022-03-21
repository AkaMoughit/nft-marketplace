'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Listing extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Listing.belongsTo(models.Nft);
      Listing.belongsTo(models.Profile);
      Listing.hasMany(models.Activity);
      Listing.hasMany(models.Offer);
    }
  }
  Listing.init({
    price: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    sale_end_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};