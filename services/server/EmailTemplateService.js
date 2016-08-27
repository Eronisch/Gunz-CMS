var ServerContext = require('../../database/ServerContext.js');

exports.getRequestUsernameTemplate = getRequestUsernameTemplate;
exports.getResetPasswordTemplate = getResetPasswordTemplate;

function getRequestUsernameTemplate(account) {
    return new Promise(function (resolve, reject) {
        getTemplate(1).then(function (template) {
            template.Message = getTemplateMessage({
                username: account.Name,
                email: account.Email
            }, template.Message);
            resolve(template);
        }).catch(reject);
    });
}

function getResetPasswordTemplate(account, resetCode, link) {
    return new Promise(function (resolve, reject) {
        getTemplate(2).then(function (template) {
            template.Message = getTemplateMessage({
                username: account.Name,
                email: account.Email,
                code: resetCode,
                link: link + '/reset-password/' + resetCode
            }, template.Message);
            resolve(template);
        }).catch(reject);
    });
}

function getTemplateMessage(values, message) {
    var returnMessage = message;
    for (var key in values) {
        var regEx = new RegExp('{{' + key + '}}', 'g');
        returnMessage = returnMessage.replace(regEx, values[key]);
    }
    return returnMessage;
}

function getTemplate(id) {
    return ServerContext.EmailTemplateModel.findOne({where: {Id: id}});
}
