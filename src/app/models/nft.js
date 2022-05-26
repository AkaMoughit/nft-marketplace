'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Nft extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.models = models;
      // define association here
      Nft.belongsTo(models.CustomOffer);
      Nft.belongsTo(models.Profile, {
        as: 'Creator',
        foreignKey: {
          name: 'CreatorId'
        }
      });
      Nft.belongsTo(models.NftCollection);
      Nft.hasOne(models.NftOwnership);
      Nft.hasMany(models.Attachment);
      Nft.hasMany(models.Listing);
      Nft.hasMany(models.FavoriteList);
      Nft.belongsToMany(models.Profile, { through: 'FavoriteList' });
    }
  }
  Nft.init({
    creation_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    contract_adress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
      validate: {
        notNull: true
      }
    },

    token_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true
      }
    },
  }, {
    sequelize,
    modelName: 'Nft',
    hooks: {
      async afterSave(instance, options) {
        let nftOwnership = this.models.NftOwnership.build({
          NftId: instance.id,
          OwnerId: instance.CreatorId,
          createdAt: new Date(),
          updatedAt: new Date()
        });

        try{
          await nftOwnership.save();
          console.log("nft ownership added");
        } catch (e) {
          console.log(e);
        }
      },

      async afterBulkCreate(instances, options) {
        for (const instance of instances) {
          let nftOwnership = this.models.NftOwnership.build({
            NftId: instance.id,
            OwnerId: instance.CreatorId,
            createdAt: new Date(),
            updatedAt: new Date()
          });

          await nftOwnership.save();
        }
        console.log("nft ownerships added");
      }
    }
  });
  return Nft;
};