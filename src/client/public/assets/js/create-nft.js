import {ethers} from "./ethers.js";

import {updateAccountAddress} from "./metamask.js";

let provider;
if(window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
}
const Marketplace = await (await fetch("../contracts/Marketplace.json")).json();
const MarketplaceAddress = await (await fetch("../contracts/Marketplace-address.json")).json();
const Nft = await (await fetch("../contracts/NFT.json")).json();
const NftAddress = await (await fetch("../contracts/NFT-address.json")).json();

const toWei = (number) => ethers.utils.parseEther(number.toString());
const fromWei = (number) => ethers.utils.formatEther(number);

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

function mint(uri) {
    return new Promise(async (resolve, reject) => {
        const URI = uri;

        const signer = provider.getSigner();

        let nftContract = new ethers.Contract(NftAddress, Nft.abi, signer);

        try {
            await (await nftContract.mint(URI)).wait();
            const tokenCount = (await nftContract.tokenCount()).toString();

            resolve(tokenCount);
        } catch (e) {
            console.log(e);
            reject("Error while performing transaction");
        }
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

            try {
                console.log("File uploading...");
                uri = (await uploadDataToIpfs({filePath, name, desc, listingType, nftCategory})).dataPath;
            } catch (err) {
                console.log(err);
                return reject("IPFS error while uploading nft details");
            }
            console.log("finished uploading");
            console.log(uri);
            return resolve(uri);
        }
    );
}

$(".create-nft-button").on('click', async function() {
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
        try{
            uri = await getUri(accounts[0]);
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
            if (uri === null) throw new Error("files not uploaded");
            const price = $('#priceInput').val();

            let tokenCount;
            switch ($(this).data('transaction')) {
                case 'create':
                    tokenCount = await mint(uri);
                    break;
                case 'list':
                    tokenCount = await mintAndList(uri, price);
                    break;
                default:
                    throw new Error("Operation invalid");
            }

            $("#popup").html(`Operation finished successfully.<br/>Your token ID: ${tokenCount}`);
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
});

$("#upload-field").on("change", () => {
    const files = $('#upload-file').prop('files');
    if (files.length > 0) {
        let preview = $("#image-preview");
        if (preview.length) {
            preview.attr("src", URL.createObjectURL(files[0]));
            $("#upload-field").append(preview);
        } else {
            preview = document.createElement("img");
            preview.setAttribute("id", "image-preview");
            preview.setAttribute("src", URL.createObjectURL(files[0]));
            $("#upload-field").append(preview);
        }
    }
});
