'use strict'

const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt");
const session = require('express-session');
const userRepository = require('../repositories/UserRepository');
const profileRepository = require('../repositories/ProfileRepository');

class AuthenticationService {
    constructor(userRepository, profileRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    register(reqBody) {
        return new Promise(async (resolve, reject) => {
            const userTBR = {
                email: reqBody.email,
                password: reqBody.password,
                phone_number: reqBody.phone_number
            }
            try {
                let [user, created] = await this.userRepository.save(userTBR);
                if (created) {
                    console.log("user created : ", user.dataValues.id);
                    const profileTBR = {
                        name: reqBody.name,
                        profile_id: '@' + reqBody.name.replace(/\s/g, '') + '.' + uuidv4(),
                        UserId: user.id,
                        birthdate: reqBody.birthdate,
                        specialize_in: reqBody.specialize_in
                    }
                    let [profile, created] = await this.profileRepository.save(profileTBR)
                    if (created) {
                        console.log("profile created : ", profile.dataValues.name);
                        resolve("Profile created successfully");
                    } else {
                        console.log("profile exists : ", profile.dataValues.name);
                        reject("User not created");
                    }
                } else {
                    console.log("email not available : " + user.dataValues.email);
                    reject("A profile with this email already exists");
                }
            } catch (err) {
                console.log('error user creation : ' + err);
                reject("An error has occurred");
            }
        });
    }

    login(reqBody) {
        return new Promise(async (resolve, reject) => {
            this.userRepository.findByEmail(reqBody.email)
                .then(async user => {
                    try {
                        if (user && await bcrypt.compare(reqBody.password, user.password)) {
                            console.log("user found ", user.dataValues.email);
                            this.profileRepository.findByuserId(user.id)
                                .then(profile => {
                                    console.log("associated profile : ", profile.dataValues.name);
                                    resolve(profile.dataValues);
                                })
                                .catch(err => {
                                    console.log("error during finding profile : " + err)
                                    reject({userId : -2})
                                })
                        } else {
                            console.log("wrong email or password");
                            resolve({userId : -1});
                        }
                    } catch (err) {
                        console.log("error during comparing password : " + err);
                        reject({error : err});
                    }
                })
                .catch(err => {
                    console.log("error during finding user : " + err);
                    reject({error : err});
                })
        });
    }
}

module.exports = new AuthenticationService(userRepository, profileRepository)