'use strict'

const walletRepository = require("../repositories/WalletRepository");
const {reject} = require("bcrypt/promises");


class WalletService {
    constructor(walletRepository) {
        this.walletRepository = walletRepository;
    }

    insertIfNotExist(wallet) {
        return this.walletRepository.insertIfNotExist(wallet);
    }

    findByAccountAddress(accountAddress) {
        return this.walletRepository.findByAccountAddress(accountAddress);
    }


}
module.exports = new WalletService(walletRepository);