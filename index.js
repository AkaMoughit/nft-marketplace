const express = require('express');
const path = require('path');
const { port } = require('./src/configs/global.config');
const appMiddlewares = require('./src/middlewares/global');
const dbConnect = require('./src/database/connection');
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



app.set('views', path.join(global.appRoot, 'src/views'));
app.set('view engine', 'ejs');

appMiddlewares(app);
dbConnect();

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
})