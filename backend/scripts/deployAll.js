const deployNft = require('./deployNft');
const deployMarketplace = require('./deployMarketplace');
const path = require("path");
const fs = require("fs");
const hre = require("hardhat");

const storeData = (contract, srcRelativePath, name) => {
    try {
        let contractsDir = path.join(__dirname, "/../../src" + srcRelativePath)
        if(!fs.existsSync(contractsDir)) {
            fs.mkdirSync(contractsDir);
        }

        fs.writeFileSync(path.join(contractsDir, "/" + name + "-address.json"), JSON.stringify(contract.address));

        const contractArtifact = hre.artifacts.readArtifactSync(name);

        fs.writeFileSync(path.join(contractsDir, "/" + name + ".json"), JSON.stringify(contractArtifact, null, 2));
    } catch (err) {
        console.log(err);
    }
}

deployNft(storeData)
    .then(() => {process.exit(0);})
    .catch(err => {
        console.error(err);
        process.exit(0);
    });

deployMarketplace(storeData)
    .then(() => {process.exit(0);})
    .catch(err => {
        console.error(err);
        process.exit(0);
    });