const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    "node_env": process.env.NODE_ENV,
    "port": process.env.PORT,
    "sessionCfg": {
        "secret": "ksrkd4jmn93c;;xmno!squwdhsbx?mz",
        "resave": false,
        "saveUnitialized": false,
    }
};