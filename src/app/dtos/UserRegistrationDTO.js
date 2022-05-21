'use strict'

class UserRegistrationDTO {
    constructor(name, phone, email, password) {
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.email = password;
    }
}

module.exports = UserRegistrationDTO