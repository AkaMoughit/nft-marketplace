const nodemailer = require("nodemailer");

const emailVerificationConfig = require('../../configs/email-verfication.config');
const ejs = require('ejs');

let transporter = nodemailer.createTransport({
    service: emailVerificationConfig.mailService,
    auth: {
        user: emailVerificationConfig.email,
        pass: emailVerificationConfig.password
    },
});

async function verificationEmail(senderEmail, receiverEmail, verificationCode) {

    const verificationLink = 'http://localhost:3000/verifyAccount?verificationCode=' + verificationCode.toString();
    const mailBody = 'Hello,\nWelcome aboard!\nHere is your account verification link:\n';

    const data = await ejs.renderFile(global.appRoot + '/src/client/views/account-verification.ejs', {verification: {link: verificationLink}});
    const options = {
        from: senderEmail,
        to: receiverEmail,
        subject: 'Secure Artz account verification',
        text: mailBody,
        html: data
    }

    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('Verification email sent: ', info);
    });
}

module.exports = {
    transporter,
    verificationEmail
};