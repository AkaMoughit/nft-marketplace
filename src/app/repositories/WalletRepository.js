const BaseRepository = require("./BaseRepository");
const Wallet = require("../models").Wallet;
const bcrypt = require('bcrypt')

class WalletRepository extends BaseRepository {
    constructor(Wallet) {
        super(Wallet);
    }

    insertIfNotExist(wallet) {
        return new Promise(async (resolve, reject) => {
            let tx = await this.model.sequelize.transaction();
            try {
                let result = await this.model.findOrCreate({
                    where: {
                        ProfileId: wallet.ProfileId,
                        wallet_id: wallet.wallet_id
                    },
                    defaults: {
                        ProfileId: wallet.ProfileId,
                        wallet_id: wallet.wallet_id,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    },
                    individualHooks : true,
                    transaction: tx
                });
                tx.commit();
                resolve(result);
            } catch (e) {
                console.log(e);
                tx.rollback();
                reject(e);
            }
        });
    }
}

module.exports = new WalletRepository(Wallet);