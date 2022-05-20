const { expect } = require("chai");
const { ethers } = require("hardhat");

describe('Marketplace', function () {
    let Marketplace, marketplace, deployer, addr1, addr2;
    let feePercent = 1;

    beforeEach(async function() {
        Marketplace = await ethers.getContractFactory("Marketplace");

        [deployer, addr1, addr2] = await ethers.getSigners();

        marketplace = await Marketplace.deploy(feePercent);
        await marketplace.deployed();
    });
    describe('Deployement', function () {
        it('Should track feeAccount of the marketplace', async function () {
            expect(await marketplace.feeAccount()).to.equal(deployer.address);
        });
        it('Should track feePercent of the marketplace', async function () {
            expect(await marketplace.feePercent()).to.equal(feePercent);
        });
    });
});