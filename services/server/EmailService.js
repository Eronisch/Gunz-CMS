var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('../../config');

exports.sendEmail = sendEmail;

function sendEmail(toEmail, subject, message) {
    return new Promise(function (resolve, reject) {
        var transporter = nodemailer.createTransport(smtpTransport({
            host: config.email.host,
            port: config.email.port,
            connectionTimeout: 10000,
            tls: {
                rejectUnauthorized:false
            },
            auth: {
                user: config.email.address,
                pass: config.email.password
            }
        }));
        transporter.sendMail({
            from: config.email.address,
            to: toEmail,
            subject: subject,
            text: message
        }, function (err) {
            if (err) {
                return reject(err);
            }

            resolve();
        });
    });
}