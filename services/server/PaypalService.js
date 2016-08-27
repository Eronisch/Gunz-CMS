var ServerContext = require('../../database/ServerContext.js');
var DataContent = require('../../database/DataContent.js');
var Async = require('async');
var DateService = require('../../tools/DateService.js');
var PaginationHelper = require('./PaginationHelper.js');
var AccountService = require('../../services/server/AccountService.js');

exports.addPayment = addPayment;
exports.completePayment = completePayment;
exports.getUnCompletedPaymentFromAccount = getUnCompletedPaymentFromAccount;
exports.getPaypalMethodOption = getPaypalMethodOption;
exports.completeIpnPayment = completeIpnPayment;
exports.getCurrentDonationThisMonth = getCurrentDonationThisMonth;
exports.getAll = getAll;
exports.getAmountAll = getAmountAll;


function getAll(page, limit, search) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);
    if (!search) {
        search = "";
    }

    return ServerContext.PaypalModel.findAll({
        attributes: ['Id', 'AccountId', 'InvoiceId', 'PayerId', 'PaymentId', 'Date', 'PaymentOptionId', 'DateCompleted'],
        where: DataContent.literal("Account.Name LIKE " + DataContent.escape("%" + search + "%")),
        include: [{model: ServerContext.PaypalPaymentOptionsModel, required: true}, {
            model: ServerContext.AccountModel,
            required: true,
            attributes: ['Name'],
            as: 'Account'
        }],
        limit: limit,
        page: page,
        offset: offset,
        order: [['Id', 'DESC']]
    }).then(function (payments) {
        payments.forEach(function (payment) {
            payment.dataValues.Date = DateService.getLongDate(payment.dataValues.Date);

            if (payment.dataValues.DateCompleted) {
                payment.dataValues.DateCompleted = DateService.getLongDate(payment.dataValues.DateCompleted);
            }
        });

        return payments;
    });
}

function getAmountAll(search) {
    if (!search) {
        search = "";
    }

    return ServerContext.PaypalModel.count({
        where: DataContent.literal("Account.Name LIKE " + DataContent.escape("%" + search + "%")),
        include: [{model: ServerContext.PaypalPaymentOptionsModel, required: true}, {
            model: ServerContext.AccountModel,
            required: true,
            as: 'Account'
        }]
    });
}

function getCurrentDonationThisMonth() {
    return new Promise(function (resolve, reject) {
        var dateNow = new Date();
        ServerContext.PaypalModel.findAll({
            include: [{model: ServerContext.PaypalPaymentOptionsModel, required: true, attributes: ["Price"]}],
            attributes: [],
            where: {
                DateCompleted: {
                    $gt: dateNow.format('yyyy-mm-01 00:00:00'),
                    $lt: getNextMonth().format('yyyy-mm-01 00:00:00')
                }
            }
        }).then(function (payments) {
            var donationThisMonth = 0;

            payments.forEach(function (payment) {
                donationThisMonth += payment.dataValues.PaypalPaymentOption.dataValues.Price;
            });
            resolve(donationThisMonth);
        }).catch(reject);
    });
}

function addPayment(accountId, paymentId, invoiceId, paymentOptionId) {
    return ServerContext.PaypalModel.create({
        InvoiceId: invoiceId,
        PaymentId: paymentId,
        AccountId: accountId,
        PaymentOptionId: paymentOptionId,
        Date: DateService.getSqlDate()
    });
}

function getPaypalMethodOption(id) {
    return ServerContext.PaypalPaymentOptionsModel.findOne({
        where: {
            Id: id
        }
    });
}

function getUnCompletedPaymentFromAccount(accountId) {
    return ServerContext.PaypalModel.findOne({
        where: {
            AccountId: accountId,
            DateCompleted: null
        },
        order: [['Id', 'DESC']]
    });
}

function getUnCompletedPayment(paymentId) {
    return ServerContext.PaypalModel.findOne({
        where: {
            PaymentId: paymentId,
            DateCompleted: null
        }
    });
}

function getUnCompletedInvoicePayment(invoiceId, payerId) {
    return ServerContext.PaypalModel.findOne({
        where: {
            InvoiceId: invoiceId,
            PayerId: payerId,
            DateCompleted: null
        }
    });
}

function completePayment(paymentId, payerId, token) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                getUnCompletedPayment(paymentId).then(function (payment) {
                    if (!payment) {
                        callback(true);
                    }
                    callback(null, payment);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (payment, callback) {
                ServerContext.PaypalModel.update({
                    DateCompleted: DateService.getSqlDate(),
                    PayerId: payerId,
                    Token: token
                }, {
                    where: {
                        PaymentId: paymentId
                    }
                }).then(function () {
                    callback(null, payment);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (payment, callback) {
                getPaypalMethodOption(payment.PaymentOptionId).then(function (paymentOption) {
                    callback(null, paymentOption, payment);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (paymentOption, payment, callback) {
                AccountService.depositDonationCoins(payment.AccountId, paymentOption.Coins).then(function () {
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            }
        ], function (err) {
            if (err instanceof Error) {
                return reject(err);
            }
            if (err === true) {
                return resolve(false)
            } // payment already completed, not successfull
            resolve(true);
        });
    });
}

function completeIpnPayment(invoiceId, payerId) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                getUnCompletedInvoicePayment(invoiceId, payerId).then(function (payment) {
                    console.log(payment);
                    if (!payment) {
                        callback(true);
                    }
                    callback(null, payment);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (payment, callback) {
                ServerContext.PaypalModel.update({
                    DateCompleted: DateService.getSqlDate()
                }, {
                    where: {
                        InvoiceId: invoiceId
                    }
                }).then(function () {
                    callback(null, payment);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (payment, callback) {
                getPaypalMethodOption(payment.PaymentOptionId).then(function (paymentOption) {
                    callback(null, paymentOption, payment);
                }).catch(function (err) {
                    callback(err);
                });
            },
            function (paymentOption, payment, callback) {
                AccountService.depositDonationCoins(payment.AccountId, paymentOption.Coins).then(function () {
                    callback();
                }).catch(function (err) {
                    callback(err);
                });
            }
        ], function (err) {
            if (err instanceof Error) {
                return reject(err);
            }

            resolve();
        });
    });
}

function getNextMonth() {
    var now = new Date();
    if (now.getMonth() == 11) {
        return new Date(now.getFullYear() + 1, 0, 1);
    } else {
        return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
}