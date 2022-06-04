'use strict'

const { v4: uuidv4 } = require('uuid');
const short = require('short-uuid');
const bcrypt = require("bcrypt");
const userRepository = require('../repositories/UserRepository');
const profileRepository = require('../repositories/ProfileRepository');
const userVerificationRepository = require('../repositories/UserVerificationRepository');
const email = require("../utils/emailVerificator");
const emailVerificationConfig = require('../../configs/email-verfication.config');

const verificationExpirationDelay = 1;

class AuthenticationService {
    constructor(userRepository, profileRepository, userVerificationRepository) {
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.userVerificationRepository = userVerificationRepository;
    }

    resetPassword(email) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await this.userRepository.findByEmail(email);
                user = user ? user.dataValues : null;
                if(user) {
                    if(user.isVerified) {
                        let pw = short().new();
                        user.password = await bcrypt.hash(pw, 10);
                        await this.userRepository.update(user);
                        const nodemailer = require("nodemailer");

                        let transporter = nodemailer.createTransport({
                            service: emailVerificationConfig.mailService,
                            auth: {
                                user: emailVerificationConfig.email,
                                pass: emailVerificationConfig.password
                            },
                        });
                        const options = {
                            from: emailVerificationConfig.email,
                            to: user.email,
                            subject: 'Secure Artz Password reset',
                            text: 'Your new password: ' + pw
                        }
                        await transporter.sendMail(options, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                        resolve("New password has been sent to this email");
                    }
                } else {
                    resolve("New password has been sent to this email");
                }
            } catch (e) {
                console.log(e);
                reject("An error occurred while sending password email");
            }
        })
    }

    emailVerification(verificationCode) {
        return new Promise(async (resolve, reject) => {
            try {
                let userVerification = await this.userVerificationRepository.findByVerificationCode(verificationCode);
                if(!userVerification) {
                    throw new Error("Invalid verification code");
                }
                if(userVerification.expirationDate.getTime() < new Date().getTime()) {
                    reject({reason: "Verification code expired"});
                } else {
                    const user = {
                        id: userVerification.UserId,
                        updatedAt: new Date(),
                        isVerified: true
                    }
                    await this.userRepository.update(user);
                    await this.userVerificationRepository.deleteByUserId(userVerification.UserId);
                    resolve(userVerification);
                }
            } catch (e) {
                console.log(e);
                reject({reason: "Invalid verification code", errorThrown: e})
            }
        });
    }

    resendVerification(targetEmail) {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await this.userRepository.findByEmail(targetEmail);
                if(user) {
                    if(!user.isVerified) {
                        let verificationCode = uuidv4();
                        const userVerification = {
                            verificationCode: verificationCode,
                            expirationDate: new Date(new Date().setDate(new Date().getDate() + verificationExpirationDelay)),
                            UserId: user.id,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                        await this.userVerificationRepository.deleteByUserId(userVerification.UserId);
                        await this.userVerificationRepository.createOrUpdate(userVerification, null);
                        await email.verificationEmail(emailVerificationConfig.email, user.email, verificationCode);
                        resolve("Email resent");
                    } else {
                        reject("Account already verified");
                    }
                } else {
                    reject("Invalid email");
                }
            } catch (e) {
                console.log(e);
                reject("An error occurred while resending verification email");
            }
        })
    }

    register(reqBody) {
        return new Promise(async (resolve, reject) => {
            const userTBR = {
                email: reqBody.email,
                password: reqBody.password,
                phone_number: reqBody.phone_number
            }
            const transaction = await this.userRepository.model.sequelize.transaction();
            try {
                let [user, created] = await this.userRepository.save(userTBR, transaction);
                if (created) {
                    console.log("user created : ", user.dataValues.id);

                    const profileTBR = {
                        name: reqBody.name,
                        profile_id: '@' + reqBody.name.replace(/\s/g, '') + '.' + short().new(),
                        UserId: user.id,
                        birthdate: reqBody.birthdate,
                        specialize_in: reqBody.specialize_in
                    }
                    let [profile, created] = await this.profileRepository.save(profileTBR, transaction)
                    if (created) {
                        let verificationCode = uuidv4();
                        const userVerification = {
                            verificationCode: verificationCode,
                            expirationDate: new Date(new Date().setDate(new Date().getDate() + verificationExpirationDelay)),
                            UserId: user.id,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }

                        await this.userVerificationRepository.createOrUpdate(userVerification, transaction);
                        await email.verificationEmail(emailVerificationConfig.email, userTBR.email, verificationCode);

                        console.log("profile created : ", profile.dataValues.name);
                        await transaction.commit();
                        resolve("Profile created successfully");
                    } else {
                        console.log("profile exists : ", profile.dataValues.name);
                        await transaction.rollback();
                        reject("User not created");
                    }
                } else {
                    console.log("email not available : " + user.dataValues.email);
                    await transaction.rollback();
                    reject("A profile with this email already exists");
                }
            } catch (err) {
                console.log('error user creation : ' + err);
                await transaction.rollback();
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
                            if(user.dataValues.isVerified) {
                                this.profileRepository.findByUserId(user.id)
                                    .then(profile => {
                                        console.log("associated profile : ", profile.dataValues.name);
                                        resolve(profile.dataValues);
                                    })
                                    .catch(err => {
                                        console.log("error during finding profile : " + err)
                                        reject({userId : -2})
                                    })
                            } else {
                                console.log("Account not verified");
                                reject({userId : -3});
                            }
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

module.exports = new AuthenticationService(userRepository, profileRepository, userVerificationRepository)