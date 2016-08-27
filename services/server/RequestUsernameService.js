var AccountService = require('./AccountService.js');
var EmailTemplateService = require('./EmailTemplateService.js');
var EmailService = require('./EmailService.js');

exports.sendRequestUsername = sendRequestUsername;

function sendRequestUsername(email) {
    return new Promise(function (resolve, reject) {
        AccountService.getByEmail(email).then(function (account) {
            EmailTemplateService.getRequestUsernameTemplate(account).then(function (emailTemplate) {
                EmailService.sendEmail(email, emailTemplate.Subject, emailTemplate.Message).then(function () {
                    resolve();
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    });
}
