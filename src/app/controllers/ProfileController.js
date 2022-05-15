const profileService = require("../services/ProfileService");
const nftService = require("../services/NftService");

exports.authorPage = function (req, res) {
    profileService.findByProfileId(req.query.profileId)
        .then(profile => {
            res.status(200).render('author', { profile: profile });
        })
        .catch(err => {
            res.status(404).render('404', { error: err });
        });
}

let pageIndex = 1;

exports.allAuthorsPage = function (req, res) {
    let pageNumberElements = 12;

    if(req.query.loadMore !== undefined) pageIndex++;
    // else if(req.query.pageIndex > 0) pageIndex = req.query.pageIndex;
    else pageIndex = 1;

    profileService.findAllAuthors(pageNumberElements, pageNumberElements * (pageIndex - 1))
        .then(profiles => {
            let isLastPage = false;
            if (pageIndex >= 0 && pageIndex > Math.floor(profiles.count / pageNumberElements)){
                isLastPage = true;
                pageIndex = Math.floor(profiles.count / pageNumberElements);
            }

            res.status(200).render('all-authors-2', { profiles: profiles.rows, isLastPage: isLastPage });
        }).catch(err => {
            res.status(404).render('404', {error: err});
    });
}