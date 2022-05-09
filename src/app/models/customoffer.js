'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomOffer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CustomOffer.belongsTo(models.Profile);
      CustomOffer.hasMany(models.OfferAttachment);
      CustomOffer.hasMany(models.Nft);
      CustomOffer.hasMany(models.Comment);
    }
  }
  CustomOffer.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    value_offered: DataTypes.DOUBLE,
    creation_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CustomOffer',
  });
  return CustomOffer;
};