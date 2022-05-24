import {ethers} from "./ethers.js";


const provider = new ethers.providers.Web3Provider(window.ethereum);
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

async function mintAndList(uri, price) {
    const URI = uri;

    const signer = provider.getSigner();

    let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, signer);
    let nftContract = new ethers.Contract(NftAddress, Nft.abi, signer);

    try {
        await (await nftContract.mint(URI)).wait();
        const tokenCount = (await nftContract.tokenCount()).toString();

        await (await nftContract.setApprovalForAll(marketplaceContract.address, true)).wait();
        await (await marketplaceContract.makeItem(nftContract.address, tokenCount, toWei(price))).wait();

        $("#popup").html(`Operation finished successfully.<br/>Your token ID: ${tokenCount}`);
        $("#popup-trigger").click();
    } catch (e) {
        $("#popup").text("Error while performing transaction");
        $("#popup-trigger").click();
        console.log(e);
    }
}

$("#create-nft-button").on('click', async () => {

    let auth = $("#create-nft-button").data('auth');
    if(!auth){
        location.href = '/signin';
        return;
    }
    if(window.ethereum) {
        const accounts = await provider.listAccounts();

        if(accounts.length === 0) {
            let accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        }

        const name = $("#itemNameInput").val();
        const desc = $('#itemDesc').val();
        const listingType = $('#listingType').val();
        const price = $('#priceInput').val();

        if(!name || !desc || !listingType || !price || isNaN(price)) {
            $("#popup").text("Some fields are empty or invalid");
            $("#popup-trigger").click();
            console.log("Some fields are empty or invalid");
            return;
        }

        const files = $('#upload-file').prop('files');
        let filePath;

        if(files.length > 0) {
            filePath = (await uploadFileToIpfs(files[0])).filePath;
        } else {
            $("#popup").text("No file uploaded");
            $("#popup-trigger").click();
            console.log("No file uploaded");
            return;
        }

        try {
            const uri = (await uploadDataToIpfs({filePath, name, desc, listingType})).dataPath;
            console.log(uri);
            await mintAndList(uri, price);
        } catch (err) {
            $("#popup").text("IPFS error while uploading nft details");
            $("#popup-trigger").click();
            console.log("IPFS error while uploading nft details")
        }
    } else {
        $("#popup").text("Metamask not installed");
        $("#popup-trigger").click();
        console.log("Metamask not installed");
    }
});

$("#upload-field").on("change", () => {
    const files = $('#upload-file').prop('files');
    if(files.length > 0) {
        let preview = $("#image-preview");
        if(preview.length) {
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