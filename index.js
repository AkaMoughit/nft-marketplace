const express = require('express');
const path = require('path');
const { port } = require('./src/configs/global.config');
const appMiddlewares = require('./src/middlewares/global');
const dbConnect = require('./src/database/connection');
const app = express();

global.appRoot = path.resolve(__dirname);

app.set('views', path.join(global.appRoot, 'src/views'));
app.set('view engine', 'ejs');

appMiddlewares(app, () => {
    try{
        const a = async () => {
            await sequelize.authenticate();
        }
        console.log('Connection to MySQL database established');
        return sequelize;
    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})