

function disableLoadMore(isLastPage) {
    let element = document.getElementById("loadMoreId");
    if (isLastPage) element.style.cssText = "pointer-events: none;";
}

function searchNft() {
    let input = document.getElementById("nftSearch");
    location.href='?searchedNft='+input.value;
}

function searchProfile() {
    let input = document.getElementById("profileSearch");
    location.href='?searchedProfile='+input.value;
}

function enableRadio(element) {
    let musicRadio = document.getElementById("musicRadioId");
    let photographyRadio = document.getElementById("photographyRadioId");
    let digitalArtRadio = document.getElementById("digitalArtRadioId");

    switch (element) {
        case musicRadio:
            photographyRadio.classList.remove("active");
            photographyRadio.classList.remove("home-3");

            digitalArtRadio.classList.remove("active");
            digitalArtRadio.classList.remove("home-3");

            element.classList.add("active");
            element.classList.add("home-3");
            break;
        case photographyRadio:
            musicRadio.classList.remove("active");
            musicRadio.classList.remove("home-3");

            digitalArtRadio.classList.remove("active");
            digitalArtRadio.classList.remove("home-3");

            element.classList.add("active");
            element.classList.add("home-3");
            break;
        case digitalArtRadio:
            photographyRadio.classList.remove("active");
            photographyRadio.classList.remove("home-3");

            musicRadio.classList.remove("active");
            musicRadio.classList.remove("home-3");

            element.classList.add("active");
            element.classList.add("home-3");
            break;
    }
}

function testSendSigner() {
    import {ethers} from "ethers";
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    $.ajax({
        url: 'http://localhost:3000/testPost',
        type: 'post',
        data: JSON.stringify(provider),
        success: function (res) {
            console.log(res);
        }
    });
}

function enableHomeElement(element) {
    // let musicRadio = document.getElementById("musicRadioId");
    // let photographyRadio = document.getElementById("photographyRadioId");
    // let digitalArtRadio = document.getElementById("digitalArtRadioId");
    //
    // switch (element) {
    //     case musicRadio:
    //         photographyRadio.classList.remove("active");
    //         photographyRadio.classList.remove("home-3");
    //
    //         digitalArtRadio.classList.remove("active");
    //         digitalArtRadio.classList.remove("home-3");
    //
    //         element.classList.add("active");
    //         element.classList.add("home-3");
    //         break;
    //     case photographyRadio:
    //         musicRadio.classList.remove("active");
    //         musicRadio.classList.remove("home-3");
    //
    //         digitalArtRadio.classList.remove("active");
    //         digitalArtRadio.classList.remove("home-3");
    //
    //         element.classList.add("active");
    //         element.classList.add("home-3");
    //         break;
    //     case digitalArtRadio:
    //         photographyRadio.classList.remove("active");
    //         photographyRadio.classList.remove("home-3");
    //
    //         musicRadio.classList.remove("active");
    //         musicRadio.classList.remove("home-3");
    //
    //         element.classList.add("active");
    //         element.classList.add("home-3");
    //         break;
    // }
}