'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CollectionFavoriteList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CollectionFavoriteList.init({
    favorite_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'CollectionFavoriteList',
  });
  return CollectionFavoriteList;
};