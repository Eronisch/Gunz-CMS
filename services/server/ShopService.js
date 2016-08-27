var ServerContext = require('../../database/ServerContext.js');
var PaginationHelper = require('./PaginationHelper.js');
var DateService = require('../../tools/DateService.js');
var NullableNumberHelper = require('../../tools/NullableNumberHelper.js');
var AccountItemModel = require('../../database/server/AccountItemModel.js');
var AccountService = require('../../services/server/AccountService.js');
var DataContent = require('../../database/DataContent.js');
var Async = require('async');
var Fs = require('fs');
var fse = require('fs-extra');
require('../../tools/Date.js');

exports.getCategories = getCategories;
exports.getShopByCategoryAndSex = getShopByCategoryAndSex;
exports.getItem = getItem;
exports.getCategoryByItemId = getCategoryByItemId;
exports.getCategory = getCategory;
exports.purchaseItem = purchaseItem;
exports.getItemsOfEachCategory = getItemsOfEachCategory;
exports.getItemOfTheDay = getItemOfTheDay;
exports.purchaseItemOfTheDay = purchaseItemOfTheDay;
exports.getStock = getStock;
exports.addAccountItem = addAccountItem;
exports.getAllItemsOfTheDay = getAllItemsOfTheDay;
exports.getAllAmountItemsOfTheDay = getAllAmountItemsOfTheDay;
exports.addItemOfTheDay = addItemOfTheDay;
exports.updateItemOfTheDay = updateItemOfTheDay;
exports.updateItemOfTheDayImage = updateItemOfTheDayImage;
exports.getAllItems = getAllItems;
exports.getAllCategories = getAllCategories;
exports.getAllCountItems = getAllCountItems;
exports.getAllCountCategories = getAllCountCategories;
exports.addItemToShop = addItemToShop;
exports.updateItemInShop = updateItemInShop;
exports.updateImageItemInShop = updateImageItemInShop;
exports.addCategory = addCategory;
exports.updateCategory = updateCategory;
exports.removeCategory = removeCategory;
exports.removeItem = removeItem;
exports.addSet = addSet;
exports.getSets = getSets;
exports.editSet = editSet;
exports.deleteSet = deleteSet;
exports.getAmountOfSets = getAmountOfSets;
exports.deleteItemOfTheDayDb = deleteItemOfTheDayDb;
exports.ITEM_PURCHASE_TYPES = ITEM_PURCHASE_TYPES;

var ITEM_PURCHASE_TYPES = {
    thirtyDays: 0,
    sixtyDays: 1,
    unlimited: 2
};

function getSets(page, limit, search) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    if (!search) {
        search = "";
    }

    return ServerContext.DonatorShopItemModel.findAll({
        order: [['Id', 'DESC']],
        offset: offset,
        limit: limit,
        where: {
            Name: {
                $like: '%' + search + '%'
            }
        },
        include: [{
            attributes: ['Id'],
            model: ServerContext.DonatorShopSetModel,
            required: true,
            include: [{
                model: ServerContext.DonatorShopSetItemModel,
                required: true,
                attributes: ['Id'],
                include: [{
                    model: ServerContext.DonatorShopItemModel,
                    required: true
                }]
            }]
        }
        ]
    });
}

function getAmountOfSets(search) {
    if (!search) {
        search = "";
    }
    return ServerContext.DonatorShopSetModel.count({
        include: [{
            model: ServerContext.DonatorShopItemModel,
            required: true,
            where: {
                Name: {
                    $like: '%' + search + '%'
                }
            }
        }]
    });
}

function editSet(setId, itemIds) {
    return deleteItemsFromSet(setId).then(function () {
        Promise.all(itemIds.map(function (itemId) {
            return addItemToSet(setId, itemId);
        }))
    });
}

function deleteItemsFromSet(setId) {
    return ServerContext.DonatorShopSetItemModel.destroy({
        where: {
            SetId: setId
        }
    });
}

function addItemToSet(setId, itemId) {
    return ServerContext.DonatorShopSetItemModel.create({
        SetId: setId,
        SetItemId: itemId
    });
}

function deleteSet(setId) {
    return ServerContext.DonatorShopSetModel.destroy({
        where: {
            Id: setId
        }
    });
}

function addSet(setId, itemIds) {
    return ServerContext.DonatorShopSetModel.create({
        DonatorShopItemId: setId
    }).then(function (dbSet) {
        return Promise.all(itemIds.map(function (itemId) {
            return addItemToSet(dbSet.Id, itemId);
        }));
    });
}

function getItemsOfEachCategory() {
    return new Promise(function (resolve, reject) {
        DataContent.query("select Id, Name, Image, CategoryId from (select Id , Name , Image, CategoryId, row_number() over(partition by CategoryId order by CategoryId DESC) as roworder from DonatorShopItem ) temp where roworder < 4 order by roworder ASC, CategoryID", {model: ServerContext.DonatorShopItemModel})
            .then(function (items) {
                resolve(items);
            }).catch(reject);
    });
}

function getCategories() {
    return ServerContext.DonatorShopCategoryModel.findAll({
        order: [['Name', 'ASC']],
        raw: true
    });
}

function getAllItems(page, limit, search) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    if (!search) {
        search = "";
    }

    return ServerContext.DonatorShopItemModel.findAll({
        where: {
            Name: {
                $like: '%' + search + '%'
            }
        },
        include: [{model: ServerContext.DonatorShopCategoryModel, required: true}],
        order: [["Id", "DESC"]],
        offset: offset,
        limit: limit
    })
}

function getAllCountItems(search) {
    if (!search) {
        search = "";
    }

    return ServerContext.DonatorShopItemModel.count({
        where: {
            Name: {
                $like: '%' + search + '%'
            }
        }
    });
}

function getAllCategories(page, limit, search) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    if (!search) {
        search = "";
    }

    return ServerContext.DonatorShopCategoryModel.findAll({
        where: {
            Name: {
                $like: '%' + search + '%'
            }
        },
        order: 'Id DESC',
        offset: offset,
        limit: limit
    })
}

function getAllCountCategories(search) {
    if (!search) {
        search = "";
    }

    return ServerContext.DonatorShopCategoryModel.count({
        where: {
            Name: {
                $like: '%' + search + '%'
            }
        }
    });
}

function getShopByCategoryAndSearchWhereQuery(categoryId, sex) {
    var whereQuery = {
        CategoryId: categoryId
    };

    if (sex) {
        whereQuery.Sex = sex;
    }

    return whereQuery;
}

function getShopByCategoryAndSex(categoryId, sex, page, limit){
    return Promise.all([getCountShopByCategoryAndSex(categoryId, sex), getShopByCategoryAndSexItems(categoryId, sex, page, limit)]).then(function(result){
        return {
            amount : result[0],
            items : result[1]
        }
    });
}

function getCountShopByCategoryAndSex(categoryId, sex) {
    return ServerContext.DonatorShopItemModel.count({
        where: getShopByCategoryAndSearchWhereQuery(categoryId, sex)
    });
}

function getShopByCategoryAndSexItems(categoryId, sex, page, limit) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    return ServerContext.DonatorShopItemModel.findAll({
        where: getShopByCategoryAndSearchWhereQuery(categoryId, sex),
        offset : offset,
        limit : limit,
        order: 'Name',
        include: [{
            attributes: ['Id'],
            model: ServerContext.DonatorShopSetModel,
            required: false,
            include: [{
                model: ServerContext.DonatorShopSetItemModel,
                required: false,
                attributes: ['Id'],
                include: [{
                    model: ServerContext.DonatorShopItemModel,
                    required: false
                }]
            }]
        }
        ]
    });
}

function getItem(id) {
    return ServerContext.DonatorShopItemModel.find({
        where: {
            Id: id
        },
        include: [{
            attributes: ['Id'],
            model: ServerContext.DonatorShopSetModel,
            required: false,
            include: [{
                model: ServerContext.DonatorShopSetItemModel,
                required: false,
                attributes: ['Id'],
                include: [{
                    model: ServerContext.DonatorShopItemModel,
                    required: false
                }]
            }]
        }
        ]
    });
}

function getItemOfTheDay() {
    return new Promise(function (resolve, reject) {
        var currDate = new Date();
        var dateToday = currDate.format('yyyy-mm-dd');
        ServerContext.DonatorDailyItemModel.findOne({
            where: {
                Date: dateToday
            }
        }).then(function (item) {
            if (!item) {
                return resolve(null);
            }
            item.dataValues.TimeStamp = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDate(), 23, 59, 59, 0).getTime();
            resolve(item);
        }).catch(reject);
    });
}

function getAllItemsOfTheDay(page, limit, search) {
    page = PaginationHelper.getPage(page);
    var offset = PaginationHelper.getOffset(page, limit);

    if (!search) {
        search = "";
    }

    return ServerContext.DonatorDailyItemModel.findAll({
        offset: offset,
        limit: limit,
        order : 'Date DESC',
        where: {
            Name: {
                $like: '%' + search + '%'
            }
        }
    }).then(function (items) {
        items.forEach(function (item) {
            item.dataValues.Date = DateService.getSqlShortDate(item.dataValues.Date);
        });

        return items;
    });
}

function getAllAmountItemsOfTheDay(search) {
    if (!search) {
        search = "";
    }

    return ServerContext.DonatorDailyItemModel.count({
        where: {
            Name: {
                $like: '%' + search + '%'
            }
        }
    });
}

function getStock() {
    return new Promise(function (resolve, reject) {
        var currDate = new Date();
        var dateToday = currDate.format('yyyy-mm-dd');
        ServerContext.DonatorDailyItemModel.findOne({
            where: {
                Date: dateToday
            },
            attributes: ['LimitAmount', 'PurchasedAmount'],
            raw: true
        }).then(function (item) {
            if(!item){
                return resolve(0);
            }

            if (!item.LimitAmount) {
                return resolve(null);
            }

            resolve(item.LimitAmount - item.PurchasedAmount);
        }).catch(reject);
    });
}

function getCategory(id) {
    return ServerContext.DonatorShopCategoryModel.findOne({
        where: {
            Id: id
        }
    });
}

function getCategoryByItemId(id) {
    return ServerContext.DonatorShopItemModel.findOne({
        where: {
            Id: id
        },
        attributes: [],
        include: [{model: ServerContext.DonatorShopCategoryModel, required: true}]
    });
}

function addAccountItem(accountId, itemId, quantity, rentDate, amountRentDays) {
    return AccountItemModel.create({
        Aid: accountId,
        ItemId: itemId,
        RentDate: rentDate,
        RentHourPeriod: amountRentDays ? (amountRentDays * 24) : null,
        Ctn: quantity
    });
}

function AddPurchaseLog(shopItemId, accountId) {
    return ServerContext.DonateShopLogModel.create({
        AccountId: accountId,
        ShopItemId: shopItemId,
        Date: DateService.getSqlDate()
    });
}

function getPriceOfShopItem(shopItem, purchaseType) {
    switch (purchaseType) {
        case ITEM_PURCHASE_TYPES.thirtyDays :
        {
            return shopItem.NewThirtyDayPrice ? shopItem.NewThirtyDayPrice : shopItem.ThirtyDayPrice;
        }
        case ITEM_PURCHASE_TYPES.sixtyDays :
        {
            return shopItem.NewSixtyDayPrice ? shopItem.NewSixtyDayPrice : shopItem.SixtyDayPrice;
        }
        case ITEM_PURCHASE_TYPES.unlimited :
        {
            return shopItem.NewUnlimitedPrice ? shopItem.NewUnlimitedPrice : shopItem.UnlimitedPrice;
        }
    }
}

function purchaseItem(shopItemId, accountId, purchaseType) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                getItem(shopItemId).then(function (item) {
                    callback(null, item);
                }).catch(callback);
            },
            function (shopItem, callback) {
                AccountService.getAccount(accountId).then(function (account) {
                    var priceItem = getPriceOfShopItem(shopItem, purchaseType);

                    if (purchaseType === ITEM_PURCHASE_TYPES.unlimited && priceItem == null) {
                        return callback(true, false);
                    }

                    if (0 > account.dataValues.DonationCoins - priceItem) {
                        return callback(true, false);
                    }

                    callback(null, shopItem, priceItem, account);
                }).catch(callback);
            },
            function (shopItem, price, account, callback) {
                AccountService.withdrawDonationCoins(accountId, price).then(function () {
                    callback(null, shopItem);
                }).catch(callback);
            },
            function (shopItem, callback) {
                var amountDaysPurchase = getAmountDaysOfPurchase(purchaseType);

                sendDonatorItemToAccount(shopItem.Id, accountId, amountDaysPurchase).then(function () {
                    callback();
                }).catch(callback);
            },
            function (callback) {
                AddPurchaseLog(shopItemId, accountId).then(function () {
                    callback(null, true);
                }).catch(callback);
            }
        ], function (err, isSuccess) {
            if (err instanceof Error) return reject(err);
            resolve(isSuccess);
        });
    });
}

function sendDonatorItemToAccount(shopItemId, accountId, amountDays) {
    return getItem(shopItemId).then(function (shopItem) {
        if (shopItem.dataValues.DonatorShopSet) {
            return sendSetToAccount(shopItemId, accountId, amountDays)
        }
        return addAccountItem(accountId, shopItem.ItemId, shopItem.Quantity, DateService.getSqlDate(), amountDays);
    });
}

function sendSetToAccount(shopItemId, accountId, amountDaysPurchase) {
    return getItem(shopItemId).then(function (shopItem) {
        return Promise.all(shopItem.dataValues.DonatorShopSet.dataValues.DonatorShopSetItems.map(function (itemSet) {
            return addAccountItem(accountId, itemSet.dataValues.DonatorShopItem.dataValues.ItemId, itemSet.dataValues.DonatorShopItem.dataValues.Quantity, DateService.getSqlDate(), amountDaysPurchase);
        }));
    });
}

function getAmountDaysOfPurchase(purchaseType) {
    switch (purchaseType) {
        case ITEM_PURCHASE_TYPES.thirtyDays :
        {
            return 30;
        }
        case ITEM_PURCHASE_TYPES.sixtyDays :
        {
            return 60;
        }
        case ITEM_PURCHASE_TYPES.unlimited :
        {
            return null;
        }
    }
}

function purchaseItemOfTheDay(accountId, purchaseType) {
    var PURCHASE_STATUS = {
        noItem: 0,
        invalidBalance: 1,
        limitReached: 2,
        unlimitedNotAvailable: 3,
        success: 4
    };

    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (callback) {
                getItemOfTheDay().then(function (item) {
                    if (!item) {
                        return callback(true, PURCHASE_STATUS.noItem);
                    }
                    callback(null, item);
                }).catch(callback);
            },
            function (item, callback) {
                if (item.LimitAmount != null && item.PurchasedAmount >= item.LimitAmount) {
                    return callback(true, PURCHASE_STATUS.limitReached);
                }

                callback(null, item);
            },
            function (item, callback) {

                item.PurchasedAmount++;

                item.save().then(function () {
                    callback(null, item);
                }).catch(callback);
            },
            function (item, callback) {
                AccountService.getAccount(accountId).then(function (account) {
                    var priceItem = getPriceOfShopItem(item, purchaseType);

                    if (purchaseType === ITEM_PURCHASE_TYPES.unlimited && priceItem == null) {
                        return callback(true, PURCHASE_STATUS.unlimitedNotAvailable);
                    }

                    if (0 > account.DonationCoins - priceItem) {
                        return callback(true, PURCHASE_STATUS.invalidBalance);
                    }

                    callback(null, item, priceItem, account);
                }).catch(callback);
            },
            function (item, price, account, callback) {
                AccountService.withdrawDonationCoins(accountId, price).then(function () {
                    callback(null, item);
                }).catch(callback);
            },
            function (item, callback) {
                var amountDays = getAmountDaysOfPurchase(purchaseType);
                addAccountItem(accountId, item.ItemId, item.Quantity, DateService.getSqlDate(), amountDays).then(function () {
                    callback(null, item);
                }).catch(callback);
            },
            function (item, callback) {
                ServerContext.DonatorDailyItemLogModel.create({
                    AccountId: accountId,
                    DailyItemId: item.Id,
                    Date: DateService.getSqlDate()
                }).then(function () {
                    callback(null, PURCHASE_STATUS.success);
                }).catch(callback);
            }
        ], function (err, status) {
            if (err instanceof Error) return reject(err);
            resolve(status);
        });
    });
}

function addItemOfTheDay(item, file, fileName) {
    return new Promise(function (resolve, reject) {
        Async.waterfall([
            function (cb) {
                addItemOfTheDayDb(item, fileName).then(function (dbItem) {
                    cb(null, dbItem);
                }).catch(cb);
            },
            function (dbItem, cb) {
                createItemOfTheDayFolder(dbItem).then(function () {
                    cb(null, dbItem);
                }).catch(cb);
            },
            function (dbItem, cb) {
                saveItemOfTheDayImage(dbItem.Id, file, fileName).then(function () {
                    cb();
                }).catch(cb);
            }
        ], function (err) {
            if (err) {
                return reject(err);
            }

            resolve();
        })
    });
}

function addCategory(name) {
    return ServerContext.DonatorShopCategoryModel.create({
        Name: name
    }).then(function (category) {
        return createDonateCategoryFolder(category.dataValues.Id);
    });
}

function updateCategory(id, name) {
    return ServerContext.DonatorShopCategoryModel.update({
            Name: name
        }, {
            where: {
                Id: id
            }
        }
    );
}

function removeCategory(id) {
    return ServerContext.DonatorShopCategoryModel.destroy({
        where: {
            Id: id
        }
    });
}

function removeItem(id) {
    return ServerContext.DonatorShopItemModel.destroy({
        where: {
            Id: id
        }
    });
}

function addItemToShop(item, file, fileName) {
    return Promise.all([addItemToShopDb(item, fileName), saveDonateShopImage(item.category, file, fileName)]);
}

function updateItemOfTheDay(id, item) {
    return ServerContext.DonatorDailyItemModel.update({
        Name: item.name,
        Description: item.description,
        ItemId: item.itemId,
        Quantity: item.quantity,
        Damage: item.damage,
        Delay: item.delay,
        Magazine: item.magazine,
        MaxBullet: item.maxBullet,
        MaxWeight: item.maxWeight,
        ReloadTime: item.reloadTime,
        Hp: item.hp,
        Ap: item.ap,
        Sex: item.sex,
        Weight: item.weight,
        ThirtyDayPrice: item.thirtyDayPrice,
        SixtyDayPrice: item.sixtyDayPrice,
        UnlimitedPrice: NullableNumberHelper.get(item.unlimitedPrice),
        LimitAmount: item.limitAmount,
        PurchasedAmount: 0,
        Date: item.date
    }, {
        where: {
            Id: id
        }
    });
}

function updateImageItemInShopDb(id, fileName) {
    return ServerContext.DonatorShopItemModel.update({
        Image: fileName
    }, {
        where: {
            Id: id
        }
    });
}

function updateItemOfTheDayImage(id, file, fileName) {
    return Promise.all([updateImageItemOfTheDayDb(id, fileName), saveItemOfTheDayImage(id, file, fileName)])
}

function updateImageItemOfTheDayDb(id, image) {
    return ServerContext.DonatorDailyItemModel.update({
        Image: image
    }, {
        where: {
            Id: id
        }
    });
}

function updateImageItemInShop(id, item, file, fileName) {
    return Promise.all([updateImageItemInShopDb(id, fileName), saveDonateShopImage(item.category, file, fileName)]);
}

function updateItemInShop(id, item) {
    return getItem(id).then(function (itemDb) {
        if (itemDb.CategoryId != item.category) {
            return moveItemShopImage(itemDb.CategoryId, item.category, itemDb.Image)
        }
    }).then(function () {
        return updateItemInShopDb(id, item);
    });
}

function moveItemShopImage(oldCategoryId, newCategoryId, filename) {
    return new Promise(function (resolve, reject) {
        fse.move("public/img/donate/" + oldCategoryId + "/" + filename, "public/img/donate/" + newCategoryId + "/" + filename, function (err) {
            if (err) {
                return reject(err);
            }

            resolve();
        })
    })
}

function updateItemInShopDb(id, item) {
    return ServerContext.DonatorShopItemModel.update({
        CategoryId: item.category,
        Name: item.name,
        Description: item.description,
        ItemId: item.itemId,
        Quantity: item.quantity,
        Damage: item.damage,
        Delay: item.delay,
        Magazine: item.magazine,
        MaxBullet: item.maxBullet,
        MaxWeight: item.maxWeight,
        ReloadTime: item.reloadTime,
        Hp: item.hp,
        Ap: item.ap,
        Sex: item.sex,
        Weight: item.weight,
        ThirtyDayPrice: item.thirtyDayPrice,
        SixtyDayPrice: item.sixtyDayPrice,
        UnlimitedPrice: NullableNumberHelper.get(item.unlimitedPrice),
        NewThirtyDayPrice: NullableNumberHelper.get(item.newThirtyDayPrice),
        NewSixtyDayPrice: NullableNumberHelper.get(item.newSixtyDayPrice),
        NewUnlimitedPrice: NullableNumberHelper.get(item.newUnlimitedPrice),
        LimitAmount: item.limitAmount
    }, {
        where: {
            Id: id
        }
    });
}

function addItemToShopDb(item, fileName) {
    return ServerContext.DonatorShopItemModel.create({
        CategoryId: item.category,
        Name: item.name,
        Description: item.description,
        ItemId: item.itemId,
        Quantity: item.quantity,
        Damage: item.damage,
        Delay: item.delay,
        Magazine: item.magazine,
        MaxBullet: item.maxBullet,
        MaxWeight: item.maxWeight,
        ReloadTime: item.reloadTime,
        Hp: item.hp,
        Ap: item.ap,
        Sex: item.sex,
        Weight: item.weight,
        ThirtyDayPrice: item.thirtyDayPrice,
        SixtyDayPrice: item.sixtyDayPrice,
        UnlimitedPrice: NullableNumberHelper.get(item.unlimitedPrice),
        NewThirtyDayPrice: NullableNumberHelper.get(item.newThirtyDayPrice),
        NewSixtyDayPrice: NullableNumberHelper.get(item.newSixtyDayPrice),
        NewUnlimitedPrice: NullableNumberHelper.get(item.newUnlimitedPrice),
        LimitAmount: item.limitAmount,
        PurchasedAmount: 0,
        Date: DateService.getSqlDate(),
        Image: fileName
    })
}

function addItemOfTheDayDb(item, fileName) {
    return ServerContext.DonatorDailyItemModel.create({
        Name: item.name,
        Description: item.description,
        ItemId: item.itemId,
        Quantity: item.quantity,
        Damage: item.damage,
        Delay: item.delay,
        Magazine: item.magazine,
        MaxBullet: item.maxBullet,
        MaxWeight: item.maxWeight,
        ReloadTime: item.reloadTime,
        Hp: item.hp,
        Ap: item.ap,
        Sex: item.sex,
        Weight: item.weight,
        ThirtyDayPrice: item.thirtyDayPrice,
        SixtyDayPrice: item.sixtyDayPrice,
        UnlimitedPrice: NullableNumberHelper.get(item.unlimitedPrice),
        PurchasedAmount: 0,
        Date: item.date,
        Image: fileName
    })
}

function deleteItemOfTheDayDb(id){
    return ServerContext.DonatorDailyItemModel.destroy({
        where : {
            Id : id
        }
    });
}


function saveDonateShopImage(categoryId, file, filename) {
    return new Promise(function (resolve, reject) {
        var path = "public/img/donate/" + categoryId + "/" + filename;
        var fstream = Fs.createWriteStream(path);
        file.pipe(fstream);
        fstream.on('close', function () {
            resolve();
        });
        fstream.on('error', function (err) {
            console.log(err);
            reject(err);
        });
    });
}

function saveItemOfTheDayImage(id, file, filename) {
    return new Promise(function (resolve, reject) {
        var path = "public/img/itemOfTheDay/" + id + "/" + filename;
        var fstream = Fs.createWriteStream(path);
        file.pipe(fstream);
        fstream.on('close', function () {
            resolve();
        });
        fstream.on('error', function (err) {
            console.log(err);
            reject(err);
        });
    });
}

function createItemOfTheDayFolder(dailyItem) {
    return new Promise(function (resolve, reject) {
        Fs.mkdir('public/img/itemOfTheDay/' + dailyItem.Id, function (err) {
            if (err) return reject(err);
            resolve();
        });
    });
}

function createDonateCategoryFolder(id) {
    return new Promise(function (resolve, reject) {
        Fs.mkdir('public/img/donate/' + id, function (err) {
            if (err) return reject(err);
            resolve();
        });
    });
}