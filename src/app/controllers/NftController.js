const nftService = require("../services/NftService");

exports.nftsPage = function(request, response) {
    nftService.listAll()
        .then(data => {
            response.status(200).render('explore', { result: data });
        }).catch(err => {
            response.status(404).send(err);
        });
}