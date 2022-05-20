const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (number) => ethers.utils.parseEther(number.toString())
const fromWei = (number) => ethers.utils.formatEther(number)

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
    describe('Making marketplace items', async function () {
        let Nft, nft, addr1, deployer;
        let URI = "URI HERE";
        beforeEach(async function() {
            Nft = await ethers.getContractFactory("NFT");
            [deployer, addr2] = await ethers.getSigners();
            nft = await Nft.connect(addr2).deploy();
            await nft.deployed();

            await nft.connect(addr2).mint(URI);
            await nft.connect(addr2).setApprovalForAll(marketplace.address, true);
        });
        it('Should track newly created item', async function () {
            await expect(marketplace.connect(addr2).makeItem(nft.address, 1, toWei(1)))
                .to.emit(marketplace, "Offered")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(1),
                    addr2.address
                );
        });
        it('Should have ownership over nft', async function () {
            await marketplace.connect(addr2).makeItem(nft.address, 1, toWei(1));
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);
        });
        it('Should have nft count as 1', async function () {
            await marketplace.connect(addr2).makeItem(nft.address, 1, toWei(1));
            expect(await marketplace.itemCount()).to.equal(1);
        });
        it('Should have correct fields values', async function () {
            await marketplace.connect(addr2).makeItem(nft.address, 1, toWei(1));
            const item = await marketplace.items(1);

            expect(item.itemId).to.equal(1);
            expect(item.nft).to.equal(nft.address);
            expect(item.tokenId).to.equal(1);
            expect(item.price).to.equal(toWei(1));
            expect(item.seller).to.equal(addr2.address);
            expect(item.sold).to.equal(false);
        });
        it('Should fail if price is 0', async function () {
            await expect(marketplace.connect(addr2).makeItem(nft.address, 1, toWei(0)))
                .to.be.revertedWith("Price must be greater than zero");
        });
    });
});