function disableLoadMore(isLastPage) {
    let element = document.getElementById("loadMoreId");
    if (isLastPage) element.style.cssText = "pointer-events: none;";
}