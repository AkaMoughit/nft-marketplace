const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const express = require("express");
const session = require('express-session');
const {sessionCfg} = require("../configs/global.config");
const cookieParser = require("cookie-parser");
const SessionStore = require('connect-session-sequelize')(session.Store);

module.exports = appMiddlewares = (app, sequelize) => {
    app.use(cookieParser());
    app.use(cors());
    app.use(morgan('dev'));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
    app.use(express.static('./src/public'));

    var sessionStore = new SessionStore({
        db: sequelize,
    });

    app.use(session({
        resave : sessionCfg.resave,
        saveUninitialized : sessionCfg.saveUnitialized,
        secret : sessionCfg.secret,
        store : sessionStore
    }));

    sessionStore.sync();

    app.use(require('../routes'));
}
