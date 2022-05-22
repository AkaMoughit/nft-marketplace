const {create} = require('ipfs-http-client');
const fs = require('fs');

exports.uploadFileToIpfs = function (filePath) {
    return new Promise(async (resolve, reject) => {
        try {
            const client = await create({
                host : "ipfs.infura.io",
                port : 5001,
                protocol : "https"
            })

            const data = new Buffer(fs.readFileSync(filePath));

            const files = await client.add(data)

            resolve(files.path)
        } catch (err) {
            console.log(err);
            reject("");
        }
    })
}