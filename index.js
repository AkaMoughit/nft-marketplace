const express = require('express');
const path = require('path');
const { port } = require('./src/configs/global.config');
const dbConnect = require('./src/database/connection');
const app = express();

global.appRoot = path.resolve(__dirname);

const appMiddlewares = require('./src/middlewares/global');
const handleSocket = require('./src/app/handlers/SocketHandler');
const Watcher = require("watcher");

app.set('views', path.join(global.appRoot, 'src/client/views'));
app.set('view engine', 'ejs');
app.locals.loading = true;

appMiddlewares(app, dbConnect());
const watcher = new Watcher('src/client/scss');

let server = app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

let io = require('socket.io')(server);

handleSocket(io);

app.use(function(req, res){
    res.status(404).render('404', { url: req.originalUrl, sessionData: {isAuth: false, profile: {}} });
});
