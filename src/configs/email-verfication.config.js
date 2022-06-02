const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    "email": process.env.AUTH_EMAIL,
    "password": process.env.AUTH_PASS,
    "mailService": process.env.MAIL_SERVICE
}