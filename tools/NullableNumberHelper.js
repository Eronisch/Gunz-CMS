exports.get = function(number){
    var parsedNumber = parseInt(number);

    return isNaN(parsedNumber) ? null : parsedNumber;
};