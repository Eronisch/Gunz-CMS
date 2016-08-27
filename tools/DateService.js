require('./Date.js');

module.exports = {
    getSqlDate : function () {
        return new Date().format("yyyy-mm-dd HH:MM:ss:l");
    },
    getSqlShortDate : function (date) {
        return new Date(date).format("yyyy-mm-dd");
    },
    getSqlDateFromDate : function (date) {
        return new Date(date).format("yyyy-mm-dd HH:MM:ss:l");
    },
    getLongDate : function (date) {
        return new Date(date).format("d mmmm yyyy, HH:MM tt");
    }
};