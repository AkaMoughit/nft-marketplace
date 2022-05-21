const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT", function () {
    let NFT, nft, deployer, addr1, addr2;
    let URI = "NFT URI HERE";

    beforeEach(async function () {
        NFT = await ethers.getContractFactory("NFT");
        [deployer, addr1, addr2] = await ethers.getSigners();

        nft = await NFT.connect(addr1).deploy();
        await nft.deployed();
    });

    describe("Deployement", function() {
        it("Should have the correct name", async function () {
            expect(await nft.name()).to.equal("Prototype NFT");
        });
        it("Should have the correct signer", async function() {
            expect(await nft.signer.getAddress()).to.equal(addr1.address);
        });
        it("Should have the correct symbol", async function() {
            expect(await nft.symbol()).to.equal("Prototype");
        });
    });

    describe("Mint", function() {
        it("Should track each minted nft", async function() {
            await nft.connect(addr1).mint(URI);

            expect(await nft.tokenCount()).to.equal(1);
            expect(await nft.balanceOf(addr1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI);

            await nft.connect(addr2).mint(URI);
            expect(await nft.tokenCount()).to.equal(2);
            expect(await nft.balanceOf(addr2.address)).to.equal(1);
            expect(await nft.tokenURI(2)).to.equal(URI);
        });
    });
});
