const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    "marketplace_signer": process.env.MARKETPLACE_SIGNER
};
