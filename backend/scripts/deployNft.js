const hre = require("hardhat");

async function deployMain(storeData) {
    await hre.run('compile');

    const [deployer] = await hre.ethers.getSigners();

    const NFT = await hre.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();

    storeData(nft, "/app/contracts", "NFT");

    console.log("NFT contract address: ", nft.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());
}

module.exports = deployMain;