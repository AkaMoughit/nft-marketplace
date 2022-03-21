const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const path = require('path');

const { port } = require('./src/configs/global.config');
const { development } = require('./src/configs/db.config');

global.appRoot = path.resolve(__dirname);

const app = express();

app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('./src/public'));

app.set('views', path.join(global.appRoot, 'src/views'));
app.set('view engine', 'ejs');

app.use(require('./src/routes'));

const sequelize = new Sequelize(development.database, development.username, development.username, {
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

app.use(function(req, res){
    res.status(404).render('404', { url: req.originalUrl });
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})