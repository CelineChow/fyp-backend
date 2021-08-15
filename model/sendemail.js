"use strict";
const nodemailer = require("nodemailer");

const sendEmail = (data) => {
    return new Promise((resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "email-smtp.ap-southeast-1.amazonaws.com",
                port: 465,
                secure: true,
                auth: {
                    user: "AKIA4AXEIWQKR3AV5JHW",
                    pass: "BLndNaAhSnm4xZ/2/eTbot4ulzkA8XP/kPIaL4vQaPOU"
                }
            })
            transporter.sendMail({
                from: data.from, // sender address
                to: data.to, // list of receivers
                subject: data.subject, // Subject line
                text: data.text, // plain text body
                html: data.html, // html body
            }).then((info) => {
                console.log("Message sent: %s", info.messageId);
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                return resolve(info);
            }).catch((err) => {
                console.log(err);
                return reject(err);
            })
        } catch (e) {
            console.log(e)
            return reject(e)
        }
    })

}

module.exports = { sendEmail }