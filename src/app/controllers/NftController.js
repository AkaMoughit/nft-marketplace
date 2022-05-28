const nftService = require('../services/NftService');

const {uploadFileToIpfs, uploadDataToIpfs} = require("../utils/UploadHelper");

exports.uploadData = async function (req, res) {
    if(typeof req.body != 'undefined') {

        try {
            let result = await uploadDataToIpfs(req.body);
            res.status(200).send({dataPath: 'https://ipfs.infura.io/ipfs/' + result});
        } catch (err) {
            if (err.code === 'ETIMEDOUT') res.status(408).send(err);
            res.status(500).send(err);
        }
    }
}

exports.uploadFile = async function (req, res) {
    if (typeof req.file !== 'undefined') {
        try {
            let result = await uploadFileToIpfs(req.file);
            res.status(200).send({filePath: 'https://ipfs.infura.io/ipfs/' + result});
        } catch (err) {
            if (err.code === 'ETIMEDOUT') res.status(408).send(err);
            console.log("ipfs error uploading file: ", err);
            res.status(500).send(err);
        }
    }
}

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