const path = require('path');
const userRepository = require('../repositories/UserRepository');

exports.welcomePage = function (req, res) {
    userRepository.findByPk(1)
        .then(result => {
            console.log(result);
            res.status(200).render('index', { data: JSON.stringify(result) });

        }).catch(error => {
            res.status(404).send("This user is not present in the database.");
        });

};

exports.explorePage = function (req, res) {
    res.status(200).render('explore', {});
}

exports.auctionPage = function (req, res) {
    res.status(200).render('auction', {});
}

exports.landingPage = function (req, res) {
    res.send("Welcome to this empty land");
};