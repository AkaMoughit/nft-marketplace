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