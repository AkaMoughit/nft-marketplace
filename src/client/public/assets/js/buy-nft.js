import {ethers} from "./ethers.js";
import {updateAccountAddress} from "./metamask.js";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const Marketplace = await (await fetch("../contracts/Marketplace.json")).json();
const MarketplaceAddress = await (await fetch("../contracts/Marketplace-address.json")).json();
const Nft = await (await fetch("../contracts/NFT.json")).json();
const NftAddress = await (await fetch("../contracts/NFT-address.json")).json();

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

$("#buy-nft-btn").on('click', async function () {
    if ($(this).data("auth")) {
        if (window.ethereum) {
            let accounts = await provider.listAccounts();

            if (accounts.length === 0) {
                accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            }

            const itemId = $(this).data("itemid");

            const signer = provider.getSigner();

            let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, signer);
            let nftContract = new ethers.Contract(NftAddress, Nft.abi, signer);

            const totalPriceInWei = await marketplaceContract.getTotalPrice(itemId);
            const balance = await provider.getBalance(accounts[0]);

            if(+fromWei(totalPriceInWei.toString()) > +fromWei(balance.toString())) {
                console.log("Not enough balance");
                console.log("Your balance: ", fromWei(balance));
                console.log("Required: ", fromWei(totalPriceInWei));

                $("#popup").html(`Not enough balance.<br/>Your balance: ${parseFloat(fromWei(balance)).toFixed(4)}<br/>Required: ${fromWei(totalPriceInWei)}`);
                $("#popup-trigger").click();
                return;
            }

            try {
                let result = await updateAccountAddress(accounts[0]);
                await (await marketplaceContract.purchaseItem(itemId, {value: totalPriceInWei})).wait();
            } catch (e) {
                if (e.status === 409) {
                    $("#popup").text(e.error);
                    $("#popup-trigger").click();
                } else {
                    console.log(e);
                }
                return;
            }
        } else {
            $("#popup").text("Metamask not installed");
            $("#popup-trigger").click();
            console.log("Metamask not installed");
        }
    } else {
        location.href = '/signin';
    }
});