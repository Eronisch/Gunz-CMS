angular.module("revolutionApp").directive('breadcrumbs', [function () {
    return {
        scope: {
                title : "=",
                links : "="
        },
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/breadcrumbs.html'
    };
}]);