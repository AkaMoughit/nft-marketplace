const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function deployMarketplace(storeData) {
    await hre.run('compile');

    const [deployer] = await hre.ethers.getSigners();

    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(1);

    storeData(marketplace, "/app/contracts", "Marketplace");

    console.log("Marketplace contract address: ", marketplace.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());
}

module.exports = deployMarketplace;