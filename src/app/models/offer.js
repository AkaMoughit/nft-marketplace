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
    value_offered: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: {
        min: 0.0001,
        notNull: true
      }
    },
    offer_date: {
    type: DataTypes.DATE,
        allowNull: false,
      validate: {
      notNull: true
      }
    },
  }, {
    sequelize,
    modelName: 'Offer',
  });
  return Offer;
};