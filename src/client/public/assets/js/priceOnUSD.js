let priceOnEth = document.getElementById("priceOnETH").innerText.split(" ")[1];
function getPriceOnUSD() {
    let url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=USD&api_key=500f63dd557f57cd85b74b296de270023da2e26f1cf245e9dbbbca5f97d00e6a";
    $.ajax({
        url: url,
        type: 'get',
        success: function (response) {
            let priceOnUSD = response.ETH.USD * priceOnEth;
            document.getElementById("priceOnUSD").innerHTML = `
                <span id="priceOnETH"><i class="icofont-coins"></i> ${priceOnEth} ETH </span>($ ${priceOnUSD})
                `
        },
        error: function (response) {
            console.log(response);
            document.getElementById("priceOnUSD").innerHTML = `
                <span id="priceOnETH"><i class="icofont-coins"></i> ${priceOnEth} ETH </span>
                `
        }
    });
}