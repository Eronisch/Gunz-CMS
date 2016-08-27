angular.module("revolutionApp").directive('download', function () {
    return {
        scope: {},
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/download.html'
    };
});