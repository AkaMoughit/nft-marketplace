import {ethers} from "./ethers.js";

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

$(document).ready(async () => {
    if(window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.listAccounts();

        if(accounts.length > 0) {
            const balance = await provider.getBalance(accounts[0]);
            $(".account-balance").text(parseFloat(fromWei(balance)).toFixed(4) + ' ETH');
        }

        window.ethereum.on('chainChanged', (_chainId) => {
            // window.location.reload();
        });

        setInterval(async () => {
            const accounts = await provider.listAccounts();
            if(accounts.length > 0) {
                const balance = await provider.getBalance(accounts[0]);
                $(".account-balance").text(parseFloat(fromWei(balance)).toFixed(4) + ' ETH');
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

export function updateAccountAddress(account) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: 'updateAccountAddress',
            type: 'post',
            data: JSON.stringify({account}),
            contentType: 'application/json',
            success: function (data, status, xhr) {
                resolve({data, status});
            },
            error: function (xhr, statusMessage, errorThrown) {
                const status = xhr.status;
                const error = xhr.responseText;
                reject({error, status});
            }
        });
    });
}

$(".metamask-connection").on('click', async () => {

    if(window.ethereum) {
        try {
            const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            const result = await updateAccountAddress(accounts[0]);

            window.location.href = "/index"
        } catch (e) {
            if (e.status === 409) {
                $("#popup").text(e.error);
                $("#popup-trigger").click();
            } else {
                console.log(e);
            }
        }

        window.ethereum.on('chainChanged', (_chainId) => {
            window.location.reload();
        });

        window.ethereum.on('accountsChanged', async (accounts) => {
            console.log("account changed triggered")
            if (accounts.length > 0) {
                try{
                    console.log(`Using account ${accounts[0]}`);
                    const result = await updateAccountAddress(accounts[0]);
                    window.location.reload();
                } catch (e) {
                    if (e.status === 409) {
                        $("#popup").text(e.error);
                        $("#popup-trigger").click();
                    } else {
                        console.log(e);
                    }
                }
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