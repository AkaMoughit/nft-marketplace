import {ethers} from "./ethers.js";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const Marketplace = await (await fetch("../contracts/Marketplace.json")).json();
const MarketplaceAddress = await (await fetch("../contracts/Marketplace-address.json")).json();
const Nft = await (await fetch("../contracts/NFT.json")).json();
const NftAddress = await (await fetch("../contracts/NFT-address.json")).json();

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

function list(price, tokenId) {
    return new Promise(async (resolve, reject) => {

        const signer = provider.getSigner();

        let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, signer);
        let nftContract = new ethers.Contract(NftAddress, Nft.abi, signer);

        try {
            await (await nftContract.setApprovalForAll(marketplaceContract.address, true)).wait();
            await (await marketplaceContract.makeItem(nftContract.address, tokenId, toWei(price))).wait();

            resolve(tokenId);
        } catch (e) {
            console.log(e);
            reject("Error while performing transaction");
        }
    });
}

$("#owned-nft-card-list-button").on('click', async function () {
    let auth = $(this).data('auth');
    if (!auth) {
        location.href = '/signin';
        return;
    }

    if (window.ethereum) {
        const accounts = await provider.listAccounts();

        if (accounts.length === 0) {
            let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        }

        let tokenId = $("#owned-nft-card-list-button").data('tokenid');
        let price = $("#owned-nft-card-price").val();

        if(!tokenId || !price || isNaN(price)) {
            $("#popup").text("Invalid information");
            $("#popup-trigger").click();
            return;
        }

        try {
            await list(price, tokenId);

            $("#popup").html(`Operation finished successfully.<br/>Your token ID: ${tokenId}`);
            $("#popup-trigger").click();
        } catch (err) {
            $("#popup").text("Error while performing transaction");
            $("#popup-trigger").click();
            console.log(err);
            console.log("Error while performing transaction")
        }
    } else {
        $("#popup").text("Metamask not installed");
        $("#popup-trigger").click();
        console.log("Metamask not installed");
    }
})