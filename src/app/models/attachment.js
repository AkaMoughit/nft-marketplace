'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attachment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attachment.belongsTo(models.CustomOffer);
      Attachment.belongsTo(models.Nft);
    }
  }
  Attachment.init({
    reference_table: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        isIn : [['nfts', 'customoffers']]
      }
    },
    attachment_url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        // iUrl: true     not working
        validateUrl(value) {
          if(!/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm.test(value)) {
            throw new Error('Url entered is not valid!');
          }
        }
      }
    }

  }, {
    sequelize,
    modelName: 'Attachment',
  });
  return Attachment;
};