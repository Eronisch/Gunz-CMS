var ServerContext = require('../../database/ServerContext.js');
var ShopService = require('../../services/server/ShopService.js');
var DateService = require('../../tools/DateService.js');

exports.sendRotationItemsToAccount = sendRotationItemsToAccount;
exports.getItemsByYearAndMonth = getItemsByYearAndMonth;
exports.getItems = getItems;
exports.deleteItem = deleteItem;
exports.addItem = addItem;

function sendRotationItemsToAccount(accountId){
    var currentDate = new Date();
    var currentMonthNumber = currentDate.getMonth();
    var currentMonthYear = currentDate.getFullYear();

    var nextMonthDate = new Date(new Date(currentDate.getTime()).setMonth(currentDate.getMonth() + 1));
    var nextMonthNumber = nextMonthDate.getMonth();
    var nextMonthYear = nextMonthDate.getFullYear();

    var firstDayThisMonth = new Date(currentMonthYear, currentMonthNumber, 1, 0, 0, 0, 0);
    var firstDayNextMonth = new Date(nextMonthYear, nextMonthNumber, 1, 0, 0, 0, 0);

    var amountDays = getAmountOfDaysBetweenDates(firstDayThisMonth, firstDayNextMonth);

    var sqlFirstDayNextMonth = DateService.getSqlDateFromDate(firstDayThisMonth);

    return getItemsByYearAndMonth(currentMonthYear, currentMonthNumber).then(function(items){
       var promises = items.map(function(item){
            return ShopService.addAccountItem(accountId, item.ItemId, 1, sqlFirstDayNextMonth, amountDays);
        });

        return Promise.all(promises);
    })
}

function getAmountOfDaysBetweenDates(firstDate, secondDate) {
    return Math.round((secondDate-firstDate)/(1000*60*60*24));
}

function getItemsByYearAndMonth(year, month){
    return ServerContext.ItemRotationModel.findAll({
        where : {
            Year: year,
            Month : month
        }
    });
}

function getItems(){
    return ServerContext.ItemRotationModel.findAll()
}

function deleteItem(id){
    return ServerContext.ItemRotationModel.destroy({
        where : {
            Id : id
        }
    })
}

function addItem(itemId, year, month){
    return ServerContext.ItemRotationModel.create({
        ItemId : itemId,
        Year : year,
        Month : month
    })
}