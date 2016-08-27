var ServerContext = require('../../database/ServerContext.js');
var DateService = require('../../tools/DateService.js');
var AccountService = require('../../services/server/AccountService.js');
var PaginationHelper = require('./PaginationHelper.js');
var Async = require('async');

exports.addPurchase = addPurchase;
exports.getAll = getAll;
exports.getAmountSearchResults = getAmountSearchResults;
exports.getAmount = getAmount;
exports.acceptPayment = acceptPayment;

function addPurchase(accountId, code, paymentOptionId) {
    return ServerContext.PaySafeCardModel.create({
        AccountId: accountId,
        Date: DateService.getSqlDate(),
        Code: code,
        PaymentOptionId: paymentOptionId
    });
}

function getAll(page, limit, search) {
    return new Promise(function (resolve, reject) {
        page = PaginationHelper.getPage(page);
        var offset = PaginationHelper.getOffset(page, limit);

        if (!search) {
            search = "";
        }

        ServerContext.PaySafeCardModel.findAll({
            limit: limit,
            offset: offset,
            include: [{
                model: ServerContext.AccountModel,
                required: true,
                where: getSearchQuery(search),
                attributes: ['UserId']
            }, {
                model: ServerContext.PaySafeCardPaymentOptionsModel,
                required: true,
                attributes: ['Coins']
            }],
            order: [['Id', 'DESC'], ['DateCompleted', 'DESC']]
        }).then(function (payments) {
            payments.forEach(function (payment) {
                payment.dataValues.Date = DateService.getLongDate(payment.dataValues.Date);
                if (payment.dataValues.DateCompleted) {
                    payment.dataValues.DateCompleted = DateService.getLongDate(payment.dataValues.DateCompleted);
                } else {
                    payment.dataValues.DateCompleted = "Never";
                }
            });
            resolve(payments);
        }).catch(reject);
    });
}

function getPaymentById(id) {
    return ServerContext.PaySafeCardModel.find({
        where: {
            Id: id
        }
    });
}

function getPaymentOptionById(id) {
    return ServerContext.PaySafeCardPaymentOptionsModel.find({
        where: {
            Id: id
        }
    })
}

function acceptPayment(id) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (cb) {
                getPaymentById(id).then(function (payment) {
                    if(payment.DateCompleted) {return cb(true);}
                    cb(null, payment);
                }).catch(cb);
            },
            function (payment, cb) {
                setPaymentToDone(id).then(function () {
                    cb(null, payment);
                }).catch(cb);
            },
            function (payment, cb) {
                getPaymentOptionById(payment.PaymentOptionId).then(function (paymentOption) {
                    cb(null, payment, paymentOption);
                }).catch(cb);
            },
            function (payment, paymentOption, cb) {
                AccountService.depositDonationCoins(payment.AccountId, paymentOption.Coins).then(function () {
                    cb(null);
                }).catch(cb);
            }
        ], function (err) {
            if (err instanceof Error) {
                return reject(err);
            }

            resolve();
        })
    });
}

function setPaymentToDone(id) {
    var currentDate = DateService.getSqlDate();
    return ServerContext.PaySafeCardModel.update({
        DateCompleted: currentDate
    }, {
        where: {
            Id: id
        }
    });
}

function getAmount() {
    return ServerContext.PaySafeCardModel.count();
}

function getAmountSearchResults(search) {
    return ServerContext.PaySafeCardModel.count({
        include: [{
            model: ServerContext.AccountModel,
            required: true,
            where: getSearchQuery(search),
            attributes: []
        }]
    });
}

function getSearchQuery(search) {
    if (!search) {
        return {};
    }
    return {
        UserId: {
            $like: '%' + search + '%'
        }
    }
}
