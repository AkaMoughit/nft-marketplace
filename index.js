const express = require('express');
const path = require('path');
const { port } = require('./src/configs/global.config');
const dbConnect = require('./src/database/connection');
const app = express();

global.appRoot = path.resolve(__dirname);

const appMiddlewares = require('./src/middlewares/global');

const {ethers} = require("ethers");
const MarketplaceAddress = require("./src/app/contracts/Marketplace-address.json");
const Marketplace = require("./src/app/contracts/Marketplace.json");
const NftAddress = require("./src/app/contracts/NFT-address.json");
const Nft = require("./src/app/contracts/NFT.json");

app.set('views', path.join(global.appRoot, 'src/client/views'));
app.set('view engine', 'ejs');
app.locals.loading = true;

appMiddlewares(app, dbConnect());

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
let marketplaceContract = new ethers.Contract(MarketplaceAddress, Marketplace.abi, provider);
let nftContract = new ethers.Contract(NftAddress, Nft.abi, provider);

nftContract.on('Minted', (a, b, c) => {
    console.log(a.toString(), b, c);
});

marketplaceContract.on('Offered', (a, b, c, d, e) => {
    console.log(a.toString(), b, c.toString(), d, e)
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});

app.use(function(req, res){
    res.status(404).render('404', { url: req.originalUrl, sessionData: {isAuth: false, profile: {}} });
});
