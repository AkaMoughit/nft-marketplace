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
    creation_date: DataTypes.DATE,
    contract_adress: DataTypes.STRING,
    token_id: DataTypes.STRING,
    description: DataTypes.TEXT,
    name: DataTypes.STRING
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

        await nftOwnership.save();
        console.log("nft ownership added");
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