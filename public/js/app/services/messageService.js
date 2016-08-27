angular.module("revolutionApp").factory("messageService", function () {

    var messageService = {};

    var successMessage;
    var errorMessage;

    messageService.addSuccessMessage = function (message) {
        successMessage = message;
    };

    messageService.addErrorMessage = function (message) {
        errorMessage = message;
    };

    messageService.getErrorMessage = function () {
        var message = errorMessage;
        errorMessage = null;
        return message;
    };

    messageService.getSuccessMessage = function () {
        var message = successMessage;
        successMessage = null;
        return message;
    };

    return messageService;
});