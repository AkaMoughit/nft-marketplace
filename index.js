const express = require('express');
const path = require('path');
const { port } = require('./src/configs/global.config');
const dbConnect = require('./src/database/connection');
const app = express();

global.appRoot = path.resolve(__dirname);

const appMiddlewares = require('./src/middlewares/global');

app.set('views', path.join(global.appRoot, 'src/client/views'));
app.set('view engine', 'ejs');
app.locals.loading = true;

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

app.use(function(req, res){
    res.status(404).render('404', { url: req.originalUrl, sessionData: {isAuth: false, profile: {}} });
});
