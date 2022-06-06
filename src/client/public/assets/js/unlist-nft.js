import {updateAccountAddress} from "./metamask.js";
import {ethers} from "./ethers.js";

let provider
if(window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
}
const Marketplace = await (await fetch("../contracts/Marketplace.json")).json();
const MarketplaceAddress = await (await fetch("../contracts/Marketplace-address.json")).json();
const Nft = await (await fetch("../contracts/NFT.json")).json();
const NftAddress = await (await fetch("../contracts/NFT-address.json")).json();

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

$(".remove-nft-btn").on('click', async function () {
    console.log("remove button clicked");
    if ($(this).data("auth")) {
        if (window.ethereum) {
            let accounts = await provider.listAccounts();

            if (accounts.length === 0) {
                accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            }

            const itemId = $(this).data("itemid");

            const signer = provider.getSigner();

            let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, signer);

            try {
                await (await marketplaceContract.removeItem(itemId)).wait();
                location.reload();
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
})