var AccountService = require('./AccountService.js');
var EmailTemplateService = require('./EmailTemplateService.js');
var EmailService = require('./EmailService.js');
var Uuid = require('node-uuid');
var Config = require('../../config.js');
var DateService = require('../../tools/DateService.js');

exports.sendResetPasswordEmail = sendResetPasswordEmail;
exports.resetPassword = resetPassword;
exports.getAvailableResetStatuses = getAvailableResetStatuses;

var STATUS = {
    noAccountFound: 0,
    isExpired: 1,
    success: 2
};

function sendResetPasswordEmail(email) {
    return new Promise(function (resolve, reject) {
        AccountService.getByEmail(email).then(function (account) {
            var passwordResetCode = getPasswordResetCode();
            AccountService.setPasswordReset(email, passwordResetCode, getExpirationDate()).then(function () {
                EmailTemplateService.getResetPasswordTemplate(account, passwordResetCode, Config.link).then(function (emailTemplate) {
                    EmailService.sendEmail(email, emailTemplate.Subject, emailTemplate.Message).then(function () {
                        resolve();
                    }).catch(reject);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    });
}

function resetPassword(code, password) {
    return new Promise(function (resolve, reject) {
        AccountService.getByPasswordResetCode(code).then(function (account) {
            if (account == null) {
                return resolve(STATUS.noAccountFound);
            }
            if (new Date() > account.PasswordResetDate) {
                return resolve(STATUS.isExpired);
            }
            Promise.all([AccountService.updatePassword(account.UserID, password), AccountService.clearPasswordReset(account.UserID)]).then(function () {
                resolve(STATUS.success);
            }).catch(reject);
        }).catch(reject);
    });
}

function getAvailableResetStatuses() {
    return STATUS;
}

function getPasswordResetCode() {
    return Uuid.v4();
}

function getExpirationDate() {
    var currentDate = new Date();
    var expirationDate = currentDate.setHours(currentDate.getHours() + 2);

    return DateService.getSqlDateFromDate(expirationDate);
}
