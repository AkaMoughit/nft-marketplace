import {ethers} from "./ethers.js";

$(window).on('load', () => {
    if($("#exploreBody").data("load")) {
        $("#loadMoreNftId").toggleClass("disableButton");
    }
});

$("#nftSearchButton").on('click', () => {
    location.href='?searchedNft=' + $("#nftSearch").val();
});

$("#profileSearchButton").on('click', () => {
    location.href='?searchedProfile=' + $("#profileSearch").val();
});

$("#musicRadioId").on('click', () => {
    $("#digitalArtRadioId, #photographyRadioId").removeClass("active home-3");

    $("#musicRadioId").addClass("active home-3");
});

$("#photographyRadioId").on('click', () => {
    $("#digitalArtRadioId, #musicRadioId").removeClass("active home-3");

    $("#photographyRadioId").addClass("active home-3");
});

$("#digitalArtRadioId").on('click', () => {
    $("#photographyRadioId, #musicRadioId").removeClass("active home-3");

    $("#digitalArtRadioId").addClass("active home-3");
});
