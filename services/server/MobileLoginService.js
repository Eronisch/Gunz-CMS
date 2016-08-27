var ServerContext = require('../../database/ServerContext.js');
var Uuid = require('node-uuid');
var Bcrypt = require('bcrypt-nodejs');
var DateService = require('../../tools/DateService.js');

exports.createLogin = createLogin;
exports.verifyLogin = verifyLogin;

function createLogin(accountId, oldSelector){
    return new Promise(function(resolve, reject){
        var token = Uuid.v4();
        var selector = Uuid.v4();

        Bcrypt.hash(token, null, null, function (err, hash){
            if(err) { return reject(err);}

            if(oldSelector){
                removeLogin(oldSelector).catch(function(err){
                    console.log(err.trace);
                });
            }

            ServerContext.AccountMobileLoginToken.create({
                Token : hash,
                Aid : accountId,
                ExpireDate : getExpirationDate(),
                Selector : selector
            }).then(function(){
                resolve({
                    token : token,
                    selector : selector
                });
            }).catch(reject);
        });
    });
}

function verifyLogin(accountId, selector, token){
    return new Promise(function(resolve, reject){
        ServerContext.AccountMobileLoginToken.findOne({
            where : {
                Aid : accountId,
                Selector : selector
            }
        }).then(function(login){
            if(!login){
                return resolve(false);
            }

            Bcrypt.compare(token, login.Token, function(err, isEqual){
                if(err) {return reject(err);}
                resolve(isEqual);
            })
        }).catch(reject);
    })
}

function removeLogin(selector){
    return ServerContext.AccountMobileLoginToken.destroy({
        where : {
            Selector : selector
        }
    });
}

function getExpirationDate() {
    var currentDate = new Date();
    var expirationDate = currentDate.setDate(currentDate.getDate() + 14);

    return DateService.getSqlDateFromDate(expirationDate);
}