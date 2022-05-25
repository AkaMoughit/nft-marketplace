const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    "marketplace_signer": process.env.MARKETPLACE_SIGNER,
    "rpc_url": process.env.RPC_URL
};
