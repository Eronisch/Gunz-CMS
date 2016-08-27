angular.module("revolutionApp").directive('clanranking', ['clanService', function (clanService) {
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/clanRanking.html',
            link : function ($scope) {

                clanService.getClanRanking(1, 5).then(function (clanData) {
                    $scope.clanRanking = clanData.clans;
                    $scope.isLoaded = true;
                });
            }
        };
    }]);