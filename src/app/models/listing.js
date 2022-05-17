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
      Listing.belongsTo(models.Profile, {
        as: 'Seller'
      });
      Listing.belongsTo(models.Profile, {
        as: 'Buyer'
      });
      Listing.belongsToMany(models.Profile, { through: 'Offer' });
    }
  }
  Listing.init({
    price: DataTypes.DOUBLE,
    type: DataTypes.STRING,
    sale_end_date: DataTypes.DATE,
    transaction_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Listing',
  });
  return Listing;
};