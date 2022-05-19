const express = require('express');
const session = require('express-session');
const SessionStore = require('connect-session-sequelize')(session.Store);
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { Sequelize } = require('sequelize');
const path = require('path');
const { port, sessionCfg } = require('./src/configs/global.config');
const { development } = require('./src/configs/db.config');
const app = express();


global.appRoot = path.resolve(__dirname);


app.use(cors());

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(express.static('./src/public'));



app.set('views', path.join(global.appRoot, 'src/views'));
app.set('view engine', 'ejs');

const sequelize = new Sequelize(development.database, development.username, development.password, {
    host: development.host,
    dialect: development.dialect
});

var sessionStore = new SessionStore({
    db: sequelize,
});

app.use(session({
    resave : sessionCfg.resave,
    saveUninitialized : sessionCfg.saveUnitialized,
    secret : sessionCfg.secret,
    store : sessionStore
}))

sessionStore.sync();

app.use(require('./src/routes'));


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