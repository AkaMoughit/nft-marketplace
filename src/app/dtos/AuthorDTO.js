class AuthorDTO {
    constructor(profileAbout, onSaleListings, ownedNfts, createdNfts) {
        this.name = profileAbout === undefined
            ? null
            : profileAbout.name;

        this.wallet_id = profileAbout === undefined
            ? null
            : profileAbout.wallet_id;

        this.picture_url = profileAbout === undefined
            ? null
            : profileAbout.picture_url;

        this.banner_url = profileAbout===undefined
            ? null
            : profileAbout.banner_url;

        this.acc_creation_date = profileAbout === undefined
            ? null
            : profileAbout.acc_creation_date;

        this.profile_id = profileAbout === undefined
            ? null
            : profileAbout.profile_id;

        this.blockchain_type = profileAbout === undefined
            ? null
            : profileAbout.blockchain_type;

        this.specialize_in = profileAbout === undefined
            ? null
            : profileAbout.specialize_in;

        this.birthdate = profileAbout === undefined
            ? null
            : profileAbout.birthdate;

        this.about = profileAbout === undefined
            ? null
            : profileAbout.about;

        this.onSaleListings = onSaleListings === undefined
            ? null
            : onSaleListings;

        this.ownedNfts = ownedNfts === undefined
            ? null
            : ownedNfts;

        this.createdNfts = createdNfts === undefined
            ? null
            : createdNfts
    }
}

module.exports = AuthorDTO;