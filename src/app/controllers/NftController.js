const nftService = require('../services/NftService');

exports.create = function (req, res) {
    nftService.save(req.body, req.session.profile.id, req.file)
        .then(promise => {
                console.log(promise);
                res.status(303).redirect("/author?profileId=" + req.session.profile.profile_id);
        })
        .catch(err => {
            console.log(err);
            res.status(303).redirect("/author?profileId=" + req.session.profile.profile_id);
        })
}