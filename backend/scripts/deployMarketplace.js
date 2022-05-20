const hre = require("hardhat");

async function main() {
    // await hre.run('compile');

    const [deployer] = await hre.ethers.getSigners();

    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(1);

    console.log("Marketplace contract address: ", marketplace.address);
    console.log("Account balance: ", (await deployer.getBalance()).toString());
}

main()
    .then(() => {process.exit(0);})
    .catch(err => {
        console.error(err);
        process.exit(0);
    });