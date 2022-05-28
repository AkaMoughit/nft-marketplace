const { rpc_url } = require('../../configs/blockchain.config');

const MarketplaceAddress = require('../contracts/Marketplace-address.json');
const Marketplace = require('../contracts/Marketplace.json');

const NftAddress = require('../contracts/NFT-address.json');
const Nft = require('../contracts/NFT.json');

class SmartContractHelper {
    static get rpcUrl() {
        return rpc_url;
    }

    static get marketplaceContract() {
        return Marketplace;
    }

    static get nftContract() {
        return Nft;
    }

    static get marketplaceAddress() {
        return MarketplaceAddress;
    }

    static get nftAddress() {
        return NftAddress;
    }

}

module.exports = SmartContractHelper;