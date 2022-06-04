'use strict'

class NftCardDTO {
    constructor(nft, profile, listing, favoriteCount, isListed) {
        this.owner_profile_id = profile === undefined
            ? null
            : profile.profile_id

        this.contract_address = nft === undefined
            ? null
            : nft.contract_adress;

        this.token_id = nft === undefined
            ? null
            : nft.token_id;

        this.description = nft === undefined
            ? null
            : nft.description;

        this.name = nft === undefined
            ? null
            : nft.name;

        this.owner_name = profile === undefined
            ? null
            : profile.name;

        this.blockchain_type = profile === undefined
            ? null
            : profile.blockchain_type;

        this.price = listing === undefined
            ? null
            : listing.price;

        this.sale_end_date = listing === undefined
            ? null
            : listing.sale_end_date;

        this.transaction_date = listing === undefined
            ? null
            : listing.transaction_date;

        this.favoriteCount = favoriteCount === undefined
            ? null
            : favoriteCount;

        this.uri = nft.uri === undefined
            ? null
            : nft.uri

        this.isListed = isListed === undefined
            ? null
            : isListed

        this.itemId = listing === undefined
            ? null
            : listing.id

        this.owner = profile === undefined
            ? null
            : profile
    }
}

module.exports = NftCardDTO;