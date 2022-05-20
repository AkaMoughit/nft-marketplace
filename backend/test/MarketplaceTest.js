'use strict';

const { expect } = require("chai");
const { ethers } = require("hardhat");

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

describe('Marketplace', function () {
    let Marketplace, marketplace, deployer, addr1, addr2, addr3;
    let feePercent = 1;

    let Nft, nft;
    let URI = "URI HERE";

    beforeEach(async function() {
        Marketplace = await ethers.getContractFactory("Marketplace");
        [deployer, addr1, addr2, addr3] = await ethers.getSigners();
        marketplace = await Marketplace.deploy(feePercent);
        await marketplace.deployed();

        Nft = await ethers.getContractFactory("NFT");
        nft = await Nft.connect(addr2).deploy();
        await nft.deployed();
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
        beforeEach(async function() {

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
    describe('Purchasing marketplace items', function () {
        let price = 2;
        let totalPriceInWei;
        beforeEach(async function() {
            await nft.connect(addr2).mint(URI);
            await nft.connect(addr2).setApprovalForAll(marketplace.address, true);
            await marketplace.connect(addr2).makeItem(nft.address, 1, toWei(price));
        });
        it('Should pay seller, mark item as sold, transfer ownership to buyer, charge fees and emit Bought event', async function () {
            const sellerInitialEthBalance = await addr2.getBalance();
            const feeAccountInitialBalance = await deployer.getBalance();

            totalPriceInWei = await marketplace.getTotalPrice(1);

            // can the same address buy his item ?
            await expect(marketplace.connect(addr1).purchaseItem(1, { value: totalPriceInWei }))
                .to.emit(marketplace, "Bought")
                .withArgs(
                    1,
                    nft.address,
                    1,
                    toWei(price),
                    addr2.address,
                    addr1.address
                );

            const sellerFinalEthBalance = await addr2.getBalance();
            const feeAccountFinalBalance = await deployer.getBalance();

            let expectedSellerEthBalance = +price + +fromWei(sellerInitialEthBalance);

            expect(+fromWei(sellerFinalEthBalance)).to.equal(expectedSellerEthBalance);

            const feeInEther = price * (feePercent / 100);
            expect(+fromWei(feeAccountFinalBalance)).to.equal(+feeInEther + +fromWei(feeAccountInitialBalance));

            expect(await nft.ownerOf(1)).to.equal(addr1.address);

            expect((await marketplace.items(1)).sold).to.equal(true);
        });
        it("Should fail for invalid item ids, sold items and when not enough ether is paid", async function () {

            await expect(marketplace.connect(addr2).purchaseItem(2, {value: totalPriceInWei}))
                .to.be.revertedWith("Item doesn't exist");
            await expect(marketplace.connect(addr2).purchaseItem(0, {value: totalPriceInWei}))
                .to.be.revertedWith("Item doesn't exist");

            await expect(marketplace.connect(addr2).purchaseItem(1, {value: toWei(price)}))
                .to.be.revertedWith("Insufficient funds");

            await marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei})

            await expect(marketplace.connect(addr3).purchaseItem(1, {value: totalPriceInWei}))
                .to.be.revertedWith("Item already sold");
        });
    });
});