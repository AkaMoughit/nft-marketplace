const path = require('path');
const userRepository = require('../repositories/userRepository');

exports.welcomePage = function (req, res) {
    userRepository.findByPk(1)
        .then(result => {
            res.status(200).render('index', { name: result.firstname });

        }).catch(error => {
            res.status(404).send("This user is not present in the database.");
        });

};

exports.landingPage = function (req, res) {
    res.send("Welcome to this empty land");
};