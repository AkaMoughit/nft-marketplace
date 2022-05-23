import {ethers} from "./ethers.js";

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

$(document).ready(async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();

    if(accounts.length > 0) {
        const balance = await provider.getBalance(accounts[0]);
        $(".account-balance").text(fromWei(balance));
    }

    setInterval(async () => {
        const accounts = await provider.listAccounts();
        if(accounts.length > 0) {
            const balance = await provider.getBalance(accounts[0]);
            $(".account-balance").text(fromWei(balance));
        } else {
            $(".account-balance").text("");
        }
        }, 1000);
});

$(".metamask-connection").on('click', async () => {

    if(window.ethereum) {
        try {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            window.location.href = "/index"
        } catch (e) {
            console.log(e.message);
        }

        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });

        window.ethereum.on('accountsChanged', (accounts) => {
            console.log("account changed triggered")
            if(accounts.length > 0) {
                console.log(`Using account ${accounts[0]}`);
                window.location.reload();
            } else {
                console.error("0 accounts found");
            }
        });

        window.ethereum.on('message', (message) => {
            console.log(message);
        });

        window.ethereum.on('connect', (info) => {
            console.log(`Connected to network ${info}`);
        });

        window.ethereum.on('disconnect', (error) => {
           console.log(`Disconnected from network ${error}`);
        });

    } else {
        console.log("Metamask not installed, please install metamask via your browser extensions");
    }
});

$("#create-nft").on('click', async () => {

    var provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();

    if(accounts.length === 0) {
        let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
    }

    // Prototype on how to create an nft
    const signer = provider.getSigner();

    let Marketplace = await (await fetch("../contracts/Marketplace.json")).json();
    let MarketplaceAddress = await (await fetch("../contracts/Marketplace-address.json")).json();

    let Nft = await (await fetch("../contracts/NFT.json")).json();
    let NftAddress = await (await fetch("../contracts/NFT-address.json")).json();

    let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, signer);
    let nftContract = new ethers.Contract(NftAddress, Nft.abi, signer);

    await nftContract.mint("URI HERE TEST");

    await nftContract.setApprovalForAll(marketplaceContract.address, true);
    await marketplaceContract.makeItem(nftContract.address, (await nftContract.tokenCount()).toString(), toWei(2));
});