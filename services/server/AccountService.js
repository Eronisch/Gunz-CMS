var Async = require('async');
var AccountModel = require('../../database/server/AccountModel.js');
var LoginModel = require('../../database/server/LoginModel.js');
var DateService = require('../../tools/DateService.js');
var PaginationHelper = require('./PaginationHelper.js');
var DataContent = require('../../database/DataContent.js');
var Bcrypt = require('bcrypt-nodejs');
var Fs = require('fs');
var FileService = require('../../services/server/FileService.js');
var Config = require('../../config.js');

var LOGIN_TYPE = {
    incorrectDetails: 0,
    blocked: 1,
    success: 2
};

exports.create = create;
exports.isEmailUnique = isEmailUnique;
exports.isNameUnique = isNameUnique;
exports.validateCredentials = validateCredentials;
exports.getAccountByUsername = getAccountByUsername;
exports.updateAccount = updateAccount;
exports.getAccountIdByUsername = getAccountIdByUsername;
exports.getAmountAccounts = getAmountAccounts;
exports.updateAvatar = updateAvatar;
exports.withdrawDonationCoins = withdrawDonationCoins;
exports.getAccount = getAccount;
exports.getAmountAllSearchResults = getAmountAllSearchResults;
exports.isGmOrAdmin = isGmOrAdmin;
exports.isStaff = isStaff;
exports.getAvatarUrl = getAvatarUrl;
exports.getByEmail = getByEmail;
exports.setPasswordReset = setPasswordReset;
exports.getByPasswordResetCode = getByPasswordResetCode;
exports.clearPasswordReset = clearPasswordReset;
exports.updatePassword = updatePassword;
exports.getAmountByNameSearchResults = getAmountByNameSearchResults;
exports.searchByName = searchByName;
exports.getAccountIdAid = getAccountIdAid;
exports.getAmount = getAmount;
exports.searchAll = searchAll;
exports.adminSearchAll = adminSearchAll;
exports.getAll = getAll;
exports.depositDonationCoins = depositDonationCoins;
exports.validateLogin = validateLogin;
exports.getAdminAll = getAdminAll;
exports.banUser = banUser;
exports.getAmountSearchAll = getAmountSearchAll;
exports.orderType = {
    ascendingName: 0,
    descendingId: 1
};
exports.loginTypes = LOGIN_TYPE;

function banUser(username, endDate) {
    return AccountModel.update({
        EndBlockDate: endDate
    }, {
        where: {
            UserId: username
        }
    }).then(function (rowsAffected) {
        return rowsAffected > 0;
    })
}

function validateLogin(username, password) {
    return validateCredentials(username, password).then(function (isValid) {
        if (!isValid) {
            return LOGIN_TYPE.incorrectDetails;
        }

        return isAccountBanned(username).then(function (isBanned) {
            return isBanned ? LOGIN_TYPE.blocked : LOGIN_TYPE.success;
        });
    })
}

function isAccountBanned(username) {
    var currentSqlDate = DateService.getSqlDate();

    return AccountModel.count({
        where: {
            UserId: username,
            EndBlockDate: {
                $gte: currentSqlDate
            }
        }
    }).then(function (amount) {
        return amount > 0;
    })
}

function isGmOrAdmin(accountId) {
    return new Promise(function (resolve, reject) {
        if (accountId == null) {
            resolve(false);
        }
        getAccount(accountId).then(function (account) {
            resolve(account.UGradeID === 255 || account.UGradeID === 252);
        }).catch(reject);
    });
}

function isStaff(accountId) {
    return new Promise(function (resolve, reject) {
        if (accountId == null) {
            resolve(false);
        }
        getAccount(accountId).then(function (account) {
            resolve(account.UGradeID >= 252);
        }).catch(reject);
    });
}

function getAmount() {
    return AccountModel.count();
}

function searchAll(page, limit, search, order) {
    return new Promise(function (resolve, reject) {
        page = PaginationHelper.getPage(page);
        var offset = PaginationHelper.getOffset(page, limit);

        AccountModel.findAll({
            order: getOrder(order),
            where: getSearchQuery(search),
            offset: offset,
            limit: limit,
            attributes: ['AID', 'UserID', 'UGradeID', 'PGradeID', 'Name', 'AvatarUrl', 'RegDate']
        }).then(function (result) {
            result.forEach(function (account) {
                account.dataValues.RegDate = DateService.getLongDate(account.dataValues.RegDate);
                account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
            });
            resolve(result);
        }).catch(reject);
    });
}

function adminSearchAll(page, limit, search, order) {
    return new Promise(function (resolve, reject) {
        page = PaginationHelper.getPage(page);
        var offset = PaginationHelper.getOffset(page, limit);

        AccountModel.findAll({
            order: getOrder(order),
            where: getSearchQuery(search),
            offset: offset,
            limit: limit,
            attributes: ['AID', 'UserID', 'UGradeID', 'PGradeID', 'Name', 'AvatarUrl', 'RegDate', 'EventCoins', 'DonationCoins']
        }).then(function (result) {
            result.forEach(function (account) {
                account.dataValues.RegDate = DateService.getLongDate(account.dataValues.RegDate);
                account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
            });
            resolve(result);
        }).catch(reject);
    });
}

function getAmountSearchAll(search) {
    return AccountModel.count({
        where: getSearchQuery(search)
    });
}

function searchByName(page, limit, search, order) {
    return new Promise(function (resolve, reject) {
        page = PaginationHelper.getPage(page);
        var offset = PaginationHelper.getOffset(page, limit);

        AccountModel.findAll({
            order: getOrder(order),
            where: getSearchByNameQuery(search),
            offset: offset,
            limit: limit,
            attributes: ['AID', 'UserID', 'UGradeID', 'PGradeID', 'Name', 'AvatarUrl', 'RegDate']
        }).then(function (result) {
            result.forEach(function (account) {
                account.dataValues.RegDate = DateService.getLongDate(account.dataValues.RegDate);
                account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
            });
            resolve(result);
        }).catch(reject);
    });
}

function getAmountByNameSearchResults(searchText) {
    return AccountModel.count({
        attributes: [],
        where: getSearchByNameQuery(searchText)
    });
}

function getAmountAllSearchResults(searchText) {
    return AccountModel.count({
        attributes: [],
        where: getSearchQuery(searchText)
    });
}

function getAll(page, limit, order) {
    return new Promise(function (resolve, reject) {
        page = PaginationHelper.getPage(page);
        var offset = PaginationHelper.getOffset(page, limit);

        AccountModel.findAll({
            order: getOrder(order),
            offset: offset,
            limit: limit,
            attributes: ['AID', 'UserID', 'UGradeID', 'PGradeID', 'Name', 'AvatarUrl', 'RegDate']
        }).then(function (result) {
            result.forEach(function (account) {
                account.dataValues.RegDate = DateService.getLongDate(account.dataValues.RegDate);
                account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
            });
            resolve(result);
        }).catch(reject);
    });
}

function getAdminAll(page, limit, order) {
    return new Promise(function (resolve, reject) {
        page = PaginationHelper.getPage(page);
        var offset = PaginationHelper.getOffset(page, limit);

        AccountModel.findAll({
            order: getOrder(order),
            offset: offset,
            limit: limit,
            attributes: ['AID', 'UserID', 'UGradeID', 'PGradeID', 'Name', 'AvatarUrl', 'RegDate', 'DonationCoins', 'EventCoins', 'Email']
        }).then(function (result) {
            result.forEach(function (account) {
                account.dataValues.RegDate = DateService.getLongDate(account.dataValues.RegDate);
                account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
            });
            resolve(result);
        }).catch(reject);
    });
}

function getByEmail(email) {
    return new Promise(function (resolve, reject) {
        AccountModel.findOne({where: {Email: email}})
            .then(function (account) {
                if (account) {
                    account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
                }
                resolve(account);
            }).catch(reject);
    })
}

function getByPasswordResetCode(code) {
    return new Promise(function (resolve, reject) {
        if (code == null) {
            return resolve(null);
        }
        AccountModel.findOne({where: {PasswordResetCode: code}})
            .then(function (account) {
                if (account) {
                    account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
                }
                resolve(account);
            }).catch(reject);
    })
}

function getAccount(id) {
    return new Promise(function (resolve, reject) {
        AccountModel.findOne({where: {Aid: id}})
            .then(function (account) {
                if (account) {
                    account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
                }
                resolve(account);
            }).catch(reject);
    })
}

function create(name, password, email) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                isNameUnique(name).then(function (isUnique) {
                    if (isUnique) {
                        callback();
                    }
                    else {
                        callback(true);
                    }
                }).catch(callback);
            },
            function (callback) {
                isEmailUnique(email).then(function (isUnique) {
                    if (isUnique) {
                        callback();
                    }
                    else {
                        callback(true);
                    }
                }).catch(callback);
            },
            function (callback) {
                createAccount(name, email).then(function () {
                    callback()
                }).catch(callback);
            }, function (callback) {
                AccountModel.findOne({where: {name: name}}).then(function (account) {
                    callback(null, account)
                }).catch(callback);
            }, function (account, callback) {
                createLogin(account, password).then(function () {
                    callback(null, account.AID);
                }).catch(callback);
            }
        ], function (err, accountId) {
            if (err) {
                reject(err);
            }
            else {
                resolve(accountId);
            }
        });
    });
}

function isEmailUnique(email) {
    return new Promise(function (resolve, reject) {
        AccountModel.count({
            where: {
                email: email
            }
        }).then(function (amount) {
            resolve(amount === 0);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function isNameUnique(name) {
    return new Promise(function (resolve, reject) {
        AccountModel.count({
            where: {
                name: name
            }
        }).then(function (amount) {
            resolve(amount === 0);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function withdrawDonationCoins(accountId, amountCoins) {
    return AccountModel.update({
        DonationCoins: DataContent.literal('DonationCoins - ' + parseInt(amountCoins))
    }, {
        where: {
            AID: accountId
        }
    });
}

function depositDonationCoins(accountId, amountCoins) {
    return AccountModel.update({
        DonationCoins: DataContent.literal('DonationCoins + ' + parseInt(amountCoins))
    }, {
        where: {
            AID: accountId
        }
    });
}

function updateAccount(username, email, password) {
    return new Promise(function (resolve, reject) {
        Async.parallel([function (callback) {
            updateEmail(username, email).then(function () {
                callback();
            });
        }, function (callback) {
            if (password) {
                updatePassword(username, password).then(function () {
                    callback();
                });
            }
            else {
                callback();
            }
        }], function (err) {
            if (err) {
                return reject(err);
            }
            resolve();
        });
    });
}

function getAccountIdByUsername(userName) {
    return new Promise(function (resolve, reject) {
        AccountModel.findOne({
            where: {
                UserId: userName
            },
            attributes: ["AID"]
        }).then(function (data) {
            return resolve(data ? data.AID : null);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getAccountIdAid(accountId) {
    return new Promise(function (resolve, reject) {
        AccountModel.findOne({
            where: {
                AID: accountId
            },
            attributes: ['AID', 'UserID', 'UGradeID', 'PGradeID', 'Name', 'AvatarUrl', 'RegDate']
        }).then(function (account) {
            if (account) {
                account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
            }

            resolve(account);
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getAmountAccounts() {
    return AccountModel.count();
}

function updateAvatar(accountId, file, fileName) {
    var AVATARFILEPATH = __dirname + "../../../public/img/account/";

    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                createMainAccountFolder(AVATARFILEPATH).then(function () {
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                createAccountFolder(accountId, AVATARFILEPATH).then(function () {
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (callback) {
                saveAccountEmblem(accountId, file, fileName, AVATARFILEPATH).then(function (fileName) {
                    callback(null, fileName);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (fileName, callback) {
                updateEmblemInDb(accountId, fileName).then(function () {
                    callback(null, fileName);
                }).catch(function (err) {
                    callback(err);
                });
            }
        ], function (err, fileName) {
            if (err) return reject(err);
            resolve(fileName);
        });
    });
}

function validateCredentials(username, password) {
    return new Promise(function (resolve, reject) {
        LoginModel.findOne({where: {UserID: username}}).then(function (login) {
            if (!login) {
                return resolve(false);
            }
            if (login.EncryptedPassword) {
                Bcrypt.compare(password, login.EncryptedPassword, function (err, isCorrect) {
                    if (err) {
                        return reject(err);
                    }
                    resolve(isCorrect);
                });
            } else {
                resolve(password === login.Password);
            }
        }).catch(function (err) {
            reject(err);
        });
    });
}

function getAvatarUrl(avatar) {
    return avatar ? avatar : "/img/no-emblem (1).jpg";
}

function setPasswordReset(email, resetCode, validTill) {
    return new Promise(function (resolve, reject) {
        getByEmail(email).then(function (account) {
            if (!account) {
                return reject(new Error('No account found with the given e-mail'));
            }
            AccountModel.update({
                PasswordResetCode: resetCode,
                PasswordResetDate: validTill
            }, {
                where: {
                    Email: email
                }
            }).then(function () {
                resolve();
            }).catch(reject);
        }).catch(reject);
    });
}

function clearPasswordReset(username) {
    return AccountModel.update({
            PasswordResetCode: null,
            PasswordResetDate: null
        },
        {
            where: {
                UserID: username
            }
        });
}

function updatePassword(username, password) {
    return new Promise(function (resolve, reject) {
        if (!password) {
            throw new Error("You haven't provide a password!")
        }

        Bcrypt.hash(password, null, null, function (err, hash) {
            if (err) {
                return reject(err);
            }

            LoginModel.update({
                Password: password,
                EncryptedPassword: hash
            }, {where: {UserId: username}}).then(function () {
                resolve();
            }).catch(reject);
        });
    });
}

function createMainAccountFolder(accountFilePath) {
    return new Promise(function (resolve, reject) {
        Fs.stat(accountFilePath, function (err) {

            if (!err) {
                return resolve();
            }

            Fs.mkdir(accountFilePath, function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function createAccountFolder(accountId, accountFilePath) {
    return new Promise(function (resolve, reject) {
        Fs.stat(accountFilePath + accountId, function (err) {
            if (!err) return resolve();

            Fs.mkdir(accountFilePath + accountId, function (err) {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

function saveAccountEmblem(accountId, file, filename, accountFilePath) {
    return new Promise(function (resolve, reject) {
        var avatarFileName = "emblem." + FileService.getExtension(filename);
        var fstream = Fs.createWriteStream(accountFilePath + accountId + '/' + avatarFileName);
        file.pipe(fstream);
        fstream.on('close', function () {
            resolve(avatarFileName);
        });
        fstream.on('error', function (err) {
            console.log(err);
            reject(err);
        });
    });
}

function updateEmblemInDb(accountId, fileName) {
    return AccountModel.update({AvatarUrl: Config.link + "/img/account/" + accountId + "/" + fileName}, {where: {Aid: accountId}});
}

function updateEmail(username, email) {
    return AccountModel.update({Email: email}, {where: {UserId: username}});
}

function createAccount(name, email) {
    return AccountModel.create({
        UserID: name,
        UGradeID: 0,
        PGradeID: 0,
        Email: email,
        Name: name
    });
}

function createLogin(account, password) {
    return new Promise(function (resolve, reject) {

        Bcrypt.hash(password, null, null, function (err, hash) {
            if (err) {
                return reject(err);
            }

            LoginModel.create({
                UserID: account.UserID,
                AID: account.AID,
                Password: password,
                EncryptedPassword: hash
            }).then(function () {
                resolve();
            }).catch(reject);
        });
    });
}

function getAccountByUsername(username) {
    return new Promise(function (resolve, reject) {
        AccountModel.findOne({where: {UserId: username}})
            .then(function (account) {
                if (account) {
                    account.dataValues.AvatarUrl = getAvatarUrl(account.dataValues.AvatarUrl);
                }
                resolve(account);
            }).catch(reject);
    })
}

function getSearchByNameQuery(search) {
    if (!search) {
        return {};
    }
    return {
        UserID: {
            $like: '%' + search + '%'
        }
    };
}

function getSearchQuery(search) {
    if (!search) {
        return {};
    }
    var whereQuery = {
        $or: [{
            UserID: {
                $like: '%' + search + '%'
            }
        },
            {
                Email: {
                    $like: '%' + search + '%'
                }
            }
        ]
    };

    if (!isNaN(search)) {
        whereQuery['$or'].push({
            Aid: search
        });
        whereQuery['$or'].push({
            UserId: search
        });
    }

    return whereQuery
}

function getOrder(orderType) {
    switch (orderType) {
        case 0 :
        {
            return [['Name', 'ASC']];
        }
        case 1 :
        {
            return [['AID', 'DESC']];
        }
        default :
        {
            return [['AID', 'ASC']];
        }
    }
}

