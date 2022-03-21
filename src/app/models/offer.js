'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Offer.belongsTo(models.Listing);
    }
  }
  Offer.init({
    value_offered: DataTypes.DOUBLE,
    offer_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Offer',
  });
  return Offer;
};