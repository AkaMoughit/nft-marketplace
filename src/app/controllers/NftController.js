const nftService = require('../services/NftService');

exports.create = function (req, res) {
    nftService.save(req.body, req.session.profileId, req.file.path)
        .then(promise => {
            if (promise === "created") {
                console.log("nft created");
            } else {
                console.log("nft not created");
            }
        })
        .catch(err => {
            console.log(err);
        })
    return res.render("all-authors", {})
}