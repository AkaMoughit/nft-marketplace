const profileService = require("../services/ProfileService");

exports.authorPage = function (req, res) {
    profileService.findByProfileId(req.query.profileId)
        .then(profile => {
            res.status(200).render('author', {profile: profile});
        })
        .catch(err => {
            res.status(404).render('404', {error: err});
        });
}