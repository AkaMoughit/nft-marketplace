const { Sequelize } = require('sequelize');
const {development} = require("../configs/db.config");

module.exports = dbConnect = () => {
    var sequelize = new Sequelize(development.database, development.username, development.username, {
        host: development.host,
        dialect: development.dialect
    });

    try{
        const a = async () => {
            await sequelize.authenticate();
        }
        console.log('Connection to MySQL database established');

    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
}