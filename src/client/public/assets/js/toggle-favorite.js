document.addEventListener("DOMContentLoaded", () => {
    let nftsFavs = document.querySelectorAll('.nft-like');

    nftsFavs.forEach(nftFav => {
        nftFav.addEventListener('click', (event) => {
            let nftTokenId = event.target.previousElementSibling.innerText;

            $.ajax({
                url: 'toggle-nft-favorite',
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({tokenId: nftTokenId}),
                success: function (response) {
                    console.log(response);
                    event.target.nextElementSibling.innerText = response.nftFavoriteCount;
                },
                error: function(response) {
                    console.log(response);
                }
            })
        })
    })
})
