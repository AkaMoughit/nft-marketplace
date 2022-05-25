const {create} = require('ipfs-http-client');
const fs = require('fs');
const bufferFrom = require('buffer-from');

exports.uploadFileToIpfs = function (file) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await create({
                host : "ipfs.infura.io",
                port : 5001,
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
                host : "ipfs.infura.io",
                port : 5001,
                protocol : "https"
            })

            const files = await client.add(JSON.stringify(data));
            resolve(files.path)
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

exports.downloadDataFromIpfs = async function (path) {
    const client = await create({
        host: "ipfs.infura.io",
        port: 5001,
        protocol: "https"
    })
    let data = await client.cat(path)
    return data;
}