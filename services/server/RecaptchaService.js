var Recaptcha = require('nodejs-nocaptcha-recaptcha');

var RECAPTCHA_PUBLIC_KEY = '6Lf3FBATAAAAAC7QArA2xTBURkOmuuJofaSy797A';
var RECAPTCHA_PRIVATE_KEY = '6Lf3FBATAAAAAOv9YsVoEK3Y2xAsRH4VxueNPhNc';

exports.getPublicKey = getPublicKey;
exports.getPrivateKey = getPrivateKey;
exports.validateCaptcha = validateCaptcha;

function getPublicKey() {
    return RECAPTCHA_PUBLIC_KEY;
}

function getPrivateKey() {
    return RECAPTCHA_PRIVATE_KEY;
}

function validateCaptcha(captcha) {
    return new Promise(function (resolve) {
        Recaptcha(captcha, getPrivateKey(), function (success) {
            resolve(success);
        });
    });
}
