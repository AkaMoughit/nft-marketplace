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
      this.models = models;
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
    price: {
        type: DataTypes.DOUBLE,
        allowNull : false,
        validate: {
            notNull: true,
            min: 0.0001
        }
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: true,
            isIn: [['NORMAL', 'AUCTION']]
        }
    },
    sale_end_date: DataTypes.DATE,
    transaction_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Listing',
    hooks: {
      async afterUpdate(instance, options) {
        if(instance.BuyerId !== undefined && instance.transaction_date !== undefined) {
          await this.models.NftOwnership.update(
              {
                OwnerId: instance.BuyerId,
                transaction_date: instance.transaction_date,
                price: instance.price,
                updatedAt: new Date()
              },
              {
                where: {
                  NftId: instance.NftId
                }
              });
          console.log("pages ownership updated");
        }
      },

      async afterBulkCreate(instances, options) {
        for (const instance of instances) {
          if (instance.BuyerId !== undefined && instance.transaction_date !== undefined) {
            await this.models.NftOwnership.update(
                {
                  OwnerId: instance.BuyerId,
                  transaction_date: instance.transaction_date,
                  price: instance.price,
                  updatedAt: new Date()
                },
                {
                  where: {
                    NftId: instance.NftId
                  }
                });
          }
        }
          console.log("pages ownerships updated");
      }
    }
  });
  return Listing;
};