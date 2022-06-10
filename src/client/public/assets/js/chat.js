import {updateAccountAddress} from "./metamask.js";
import {ethers} from "./ethers.js";

const socket = io();

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

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const currentProfileId = document.getElementById('currentProfileId').innerText;
const otherParticipantId = document.getElementById('otherParticipantId').innerText;
const currentProfileName = document.getElementById('currentProfileName').innerText;
const otherParticipantName = document.getElementById('otherParticipantName').innerText;
const conversationId = document.getElementById('conversationId').innerText;
const closeButton = document.getElementById('close-conversation');

$(".buy-nft-btn").on('click', async function () {
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
});

async function uploadDataToIpfs(object) {
    return $.ajax({
        url: 'uploadData',
        type: 'post',
        data: JSON.stringify(object),
        contentType: 'application/json',
    });
}

async function uploadFileToIpfs(file) {
    let fd = new FormData();
    fd.append('file', file);

    return $.ajax({
        url: 'uploadFile',
        type: 'post',
        data: fd,
        contentType: false,
        processData: false,
    });
}

function mintAndList(uri, price) {
    return new Promise(async (resolve, reject) => {
        const URI = uri;

        const signer = provider.getSigner();

        let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, signer);
        let nftContract = new ethers.Contract(NftAddress, Nft.abi, signer);

        try {
            await (await nftContract.mint(URI)).wait();
            const tokenCount = (await nftContract.tokenCount()).toString();

            await (await nftContract.setApprovalForAll(marketplaceContract.address, true)).wait();
            await (await marketplaceContract.makeItem(nftContract.address, tokenCount, toWei(price))).wait();

            const listingId = (await marketplaceContract.itemCount()).toString();

            const msgBody = document.getElementById('msg').value;
            const message =  {
                send_date: new Date(),
                body: msgBody,
                ProfileId : currentProfileId,
                ConversationId : conversationId,
                ListingId: listingId
            }

            socket.emit('message', message);
            document.getElementById('msg').value = ''

            resolve(tokenCount);
        } catch (e) {
            console.log(e);
            reject("Error while performing transaction");
        }
    });
}

function getUri() {
    return new Promise(async (resolve, reject) => {
            let uri = null;

            const name = $("#itemNameInput").val();
            const desc = $('#itemDesc').val();
            const listingType = $('#listingType').val();
            const price = $('#priceInput').val();
            let nftCategory;

            let nftCategories = document.getElementsByName('nft-category');

            for(let category of nftCategories) {
                if(category.checked) {
                    nftCategory = category.value;
                }
            }

            if (!name || !desc || !listingType || !price || isNaN(price)) {
                return reject("Some fields are empty or invalid");
            }

            const files = $('#upload-file').prop('files');
            let filePath;

            if (files.length > 0) {
                try {
                    console.log("File uploading...");
                    filePath = (await uploadFileToIpfs(files[0])).filePath;
                    console.log("finished uploading");
                } catch (err) {
                    console.log(err);
                    return reject("IPFS error while uploading nft details");
                }
            } else {
                return reject("No file uploaded");
            }


            let data = {filePath, name, desc, listingType, nftCategory};
            try {
                console.log("File uploading...");
                uri = (await uploadDataToIpfs(data)).dataPath;
            } catch (err) {
                console.log(err);
                return reject("IPFS error while uploading nft details");
            }
            console.log("finished uploading");
            console.log(uri);
            return resolve({uri: uri, data: data});
        }
    );
}

$("#make-offer-button").on('click', function () {
    $("#offer-popup-trigger").click();
})

$(".make-offer-button").on('click', async function () {
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

        let uri = null;
        let data = null;
        try {
            var uriResult = await getUri(accounts[0]);
            uri = uriResult.uri;
            data = uriResult.data;

            let result = await updateAccountAddress(accounts[0]);
        } catch (e) {
            if (e.status === 409) {
                $("#popup").text(e.error);
                $("#popup-trigger").click();
            } else {
                console.log(e);
                $("#popup").text(e);
                $("#popup-trigger").click();
            }
            return;
        }

        try {
            if (uri === null || data === null) throw new Error("files not uploaded");
            const price = $('#priceInput').val();

            await mintAndList(uri, price);

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

socket.on('message', message => {
    displayMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;

    document.getElementById('msg').value = '';
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const msgBody = document.getElementById('msg').value;
    const message =  {
        send_date: new Date(),
        body: msgBody,
        ProfileId : currentProfileId,
        ConversationId : conversationId
    }
    socket.emit('message', message);
    document.getElementById('msg').value = ''
})

$("#close-conversation").on('click', () => {
    $.ajax({
        url: '/delete-conversation/',
        data: {conversationId},
        type: 'POST',
        'success': function (data, textStatus) {
            window.location.href = "conversation";
        },
        'error': function (data, textStatus) {
            window.location.href = "conversation";
        }
    });
})

function displayMessage(message) {
    let ownerName, messageClass;
    if (message.ProfileId.toString() === currentProfileId) {
        ownerName = currentProfileName;
        messageClass = 'messageCurrent';
    } else {
        ownerName = otherParticipantName;
        messageClass = 'messageParticipant';
    }
    if (message.Listing) {
        location.reload();
        return;
    }
    const div = document.createElement('div');
    div.classList.add(messageClass);
    div.innerHTML = `<p class="meta">${ownerName}
                        <span>${new Date()}</span>
                        </p>
                        <p class="text">
                            ${message.body} 
                        </p>`;
    document.querySelector('.chat-messages').appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

$(document).ready(function () {
    socket.emit('join', conversationId);
    chatMessages.scrollTop = chatMessages.scrollHeight;
})