const {create} = require('ipfs-http-client');
const http = require("http");
const https = require("https");

const IPFS_HOST = "ipfs.infura.io";
const IPFS_PORT = 5001

exports.uploadFileToIpfs = function (file) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await create({
                host : IPFS_HOST,
                port : IPFS_PORT,
                protocol : "https"
            })

            const files = await client.add(file.buffer);
            resolve(files.path)
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

exports.uploadDataToIpfs = function (data) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await create({
                host : IPFS_HOST,
                port : IPFS_PORT,
                protocol : "https"
            })

            const files = await client.add(JSON.stringify(data));
            resolve(files.path)
        } catch (err) {
            console.log(err);
            reject(err);
        }
    });
}

exports.downloadDataFromIpfs = function (path) {
    return new Promise((resolve, reject) => {
        const options = {
            host: IPFS_HOST,
            path: path.replace('https://' + IPFS_HOST, ''),
            timeout: 3000
        };

        const request = https.get(options, function (response) {
            response.on('data', (chunk) => {
                resolve(JSON.parse(chunk));
            });

            request.on('timeout', () => {
               request.destroy();
               reject('TIMEOUT');
            });
        });
    });

}