'use strict'

const profileService = require("../services/ProfileService");
const nftService = require("../services/NftService");

exports.authorPage = function (req, res) {
    let sessionData;
        sessionData = {isAuth: req.session.isAuth, profile: req.session.profile};

    profileService.findByProfileId(req.query.profileId)
        .then(profile => {
            res.status(200).render('author', { profile: profile, sessionData: sessionData });
        })
        .catch(err => {
            res.status(404).render('404', { error: err, sessionData: sessionData });
        });
}

let pageIndex = 1;

exports.allAuthorsPage = function (req, res) {
    let pageNumberElements = 12;

    if(req.query.loadMore !== undefined) pageIndex++;
    // else if(req.query.pageIndex > 0) pageIndex = req.query.pageIndex;
    else pageIndex = 1;

    profileService.findAllAuthors(pageNumberElements, pageNumberElements * (pageIndex - 1), req.query.searchedProfile)
        .then(profiles => {
            let isLastPage = false;
            if (pageIndex >= 0 && pageIndex > Math.floor(profiles.count / pageNumberElements)){
                isLastPage = true;
                pageIndex = Math.floor(profiles.count / pageNumberElements);
            }

            res.status(200).render('all-authors', { profiles: profiles.rows, isLastPage: isLastPage, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
        }).catch(err => {
            res.status(404).render('404', {error: err, sessionData: { isAuth: req.session.isAuth, profile: req.session.profile }});
    });
}