const hre = require("hardhat");

async function main() {
    // await hre.run('compile');

    const [deployer] = await hre.ethers.getSigners();

    const NFT = await hre.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();

    console.log("NFT contract address: ", nft.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());
}

main()
    .then(() => {process.exit(0);})
    .catch(err => {
        console.error(err);
        process.exit(0);
    });