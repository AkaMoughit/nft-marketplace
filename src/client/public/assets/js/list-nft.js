import {ethers} from "./ethers.js";

import {updateAccountAddress} from "./metamask.js";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const Marketplace = await (await fetch("../contracts/Marketplace.json")).json();
const MarketplaceAddress = await (await fetch("../contracts/Marketplace-address.json")).json();
const Nft = await (await fetch("../contracts/NFT.json")).json();
const NftAddress = await (await fetch("../contracts/NFT-address.json")).json();

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

$(document).ready(function (){
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

    $(".owned-nft-card-list-button").on('click', async function () {
        let auth = $(this).data('auth');
        if (!auth) {
            location.href = '/signin';
            return;
        }

        if (window.ethereum) {
            let accounts = await provider.listAccounts();

            if (accounts.length === 0) {
                accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            }

            let tokenId = $(this).data('tokenid');
            let price = $("#" + tokenId).val();

            if(!tokenId || !price || isNaN(price)) {
                $("#popup").text("Invalid information");
                $("#popup-trigger").click();
                return;
            }

            try {
                let result = await updateAccountAddress(accounts[0]);
                await list(price, tokenId);

                $("#popup").html(`Operation finished successfully.<br/>Your token ID: ${tokenId}`);
                $("#popup-trigger").click();
            } catch (e) {
                if (e.status === 409) {
                    $("#popup").text(e.error);
                    $("#popup-trigger").click();
                } else {
                    $("#popup").text("Error while performing transaction");
                    $("#popup-trigger").click();
                    console.log(e);
                }
                return;
            }
        } else {
            $("#popup").text("Metamask not installed");
            $("#popup-trigger").click();
            console.log("Metamask not installed");
        }
    });
});
