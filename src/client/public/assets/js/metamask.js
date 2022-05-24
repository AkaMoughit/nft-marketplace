import {ethers} from "./ethers.js";

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

$(document).ready(async () => {
    if(window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();

        if(accounts.length > 0) {
            const balance = await provider.getBalance(accounts[0]);
            $(".account-balance").text(parseFloat(fromWei(balance)).toFixed(4));
        }

        window.ethereum.on('chainChanged', (_chainId) => {
            window.location.reload();
        });

        setInterval(async () => {
            const accounts = await provider.listAccounts();
            if(accounts.length > 0) {
                const balance = await provider.getBalance(accounts[0]);
                $(".account-balance").text(parseFloat(fromWei(balance)).toFixed(4));
            } else {
                $(".account-balance").text("");
            }
        }, 1000);
    } else {
        $("#popup").text("Metamask not installed");
        $("#popup-trigger").click();
        console.log("Metamask not installed");
    }

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

        window.ethereum.on('chainChanged', (_chainId) => {
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
            $("#popup").text(`Connected to network ${info}`);
            $("#popup-trigger").click();
            console.log(`Connected to network ${info}`);
        });

        window.ethereum.on('disconnect', (error) => {
            $("#popup").text(`Disconnected from network ${error}`);
            $("#popup-trigger").click();
           console.log(`Disconnected from network ${error}`);
        });

    } else {
        $("#popup").text("Metamask not installed, please install metamask via your browser extensions");
        $("#popup-trigger").click();
        console.log("Metamask not installed, please install metamask via your browser extensions");
    }
});