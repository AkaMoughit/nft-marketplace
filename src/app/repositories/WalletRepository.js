const BaseRepository = require("./BaseRepository");
const Wallet = require("../models").Wallet;
const bcrypt = require('bcrypt')

class WalletRepository extends BaseRepository {
    constructor(Wallet) {
        super(Wallet);
    }

    findByAccountAddress(accountAddress) {
        return this.model.findOne({
            where: {
                wallet_id: accountAddress
            }
        });
    }

    insertIfNotExist(wallet) {
        return new Promise(async (resolve, reject) => {
            let tx = await this.model.sequelize.transaction();
            this.model.findOne({
                where: {
                    wallet_id: wallet.wallet_id
                },
                transaction: tx
            }).then(async foundWallet => {
                if (foundWallet === null) {
                    try {
                        let result = await this.model.create({
                                wallet_id: wallet.wallet_id,
                                ProfileId: wallet.ProfileId,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }, {
                                individualHooks: true,
                                transaction: tx
                            }
                        );
                        tx.commit();
                        resolve(result);
                    } catch (e) {
                        console.log(e);
                        tx.rollback();
                        reject(e);
                    }
                } else if (foundWallet.ProfileId !== wallet.ProfileId) {
                    tx.rollback();
                    reject("Wallet already linked with an account");
                } else {
                    resolve(foundWallet);
                }
            }).catch(rejection => {
                tx.rollback();
                console.log(rejection);
                reject(rejection);
            });
        });
    }
}

module.exports = new WalletRepository(Wallet);