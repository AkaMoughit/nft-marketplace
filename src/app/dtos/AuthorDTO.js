class AuthorDTO {
    constructor(profileAbout, onSaleListings) {
        this.name = profileAbout.name;
        this.wallet_id = profileAbout.wallet_id;
        this.picture_url = profileAbout.picture_url;
        this.banner_url = profileAbout.banner_url;
        this.acc_creation_date = profileAbout.acc_creation_date;
        this.profile_id = profileAbout.profile_id;
        this.blockchain_type = profileAbout.blockchain_type;
        this.specialize_in = profileAbout.specialize_in;
        this.birthdate = profileAbout.birthdate;
        this.about = profileAbout.about;
        this.onSaleListings = onSaleListings;
    }
}

module.exports = AuthorDTO;