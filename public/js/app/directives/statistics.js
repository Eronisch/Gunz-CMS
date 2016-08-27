angular.module("revolutionApp").directive('statistics', ['serverStatusService', function (serverStatusService) {
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            link: function (scope, elem, attrs) {
                scope.multipleLine = attrs.multipleline != null;
                serverStatusService.getServerStatus().then(function (serverStatus) {
                    scope.serverStatus = serverStatus;
                    scope.isLoaded = true;
                });
            },
            templateUrl: '/templates/directives/statistics.html'
        };
    }]);