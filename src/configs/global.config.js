const dotenv = require('dotenv');
const path = require("path");
dotenv.config();

module.exports = {
    "node_env": process.env.NODE_ENV,
    "port": process.env.PORT
};
