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
      Profile.hasMany(models.NftCollection);
      Profile.hasMany(models.Ticket);
      Profile.hasMany(models.Comment);
      Profile.hasMany(models.Message);
      Profile.hasMany(models.FavoriteList);
      Profile.hasMany(models.NftOwnership, {
        as: 'Owner',
        foreignKey: {
          name: 'OwnerId'
        }
      });
      Profile.belongsToMany(models.Nft, { through: 'FavoriteList' });
      Profile.belongsToMany(models.Listing, { through: 'Offer' });
      Profile.belongsToMany(models.NftCollection, { through: 'CollectionFavoriteList' });
    }
  }

  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    wallet_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    picture_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        validateUrl(value) {
          if(!/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm.test(value)) {
            throw new Error('Url entered is not valid!');
          }
        }
      }
    },
    banner_url: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        validateUrl(value) {
          if(!/^((http|https):\/\/)?(www.)?(?!.*(http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm.test(value)) {
            throw new Error('Url entered is not valid!');
          }
        }
      }
    },
    acc_creation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    profile_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { // not enough
        notNull: true
      }
    },
    blockchain_type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        isIn: [['ETHEREUM']]
      }
    },
    specialize_in: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
        isIn : [['Digital Art', 'Photography', 'Music']]
      }
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    about: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};