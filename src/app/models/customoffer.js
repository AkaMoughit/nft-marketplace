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
      CustomOffer.hasMany(models.Attachment);
      CustomOffer.hasOne(models.Nft);
      CustomOffer.hasMany(models.Comment);
    }
  }
  CustomOffer.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    value_offered: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        notNull: true,
        min: 0.0001
      }
    },
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: true
      }
    }
  }, {
    sequelize,
    modelName: 'CustomOffer',
  });
  return CustomOffer;
};