class NftCardDTO {
    constructor(nft, profile, listing, favoriteCount) {
        this.owner_profile_id = profile.profile_id
        this.contract_address = nft.contract_adress;
        this.token_id = nft.token_id;
        this.description = nft.description;
        this.name = nft.name;
        this.owner_name = profile.name;
        this.blockchain_type = profile.blockchain_type;
        this.price = listing.price;
        this.sale_end_date = listing.sale_end_date;
        this.favoriteCount = favoriteCount;
    }
}

module.exports = NftCardDTO;