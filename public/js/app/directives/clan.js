angular.module("revolutionApp").directive('clan', ['clanService', '$routeParams', function (clanService, $routeParams) {
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/clan.html',
            link : function (scope) {

                getClanInfo();
                getAmountMembers();

                function getClanInfo() {
                    clanService.getById($routeParams.id).then(function (clan) {
                        scope.clan = clan;
                    });
                }
                
                function getAmountMembers() {
                    clanService.getAmountMembers($routeParams.id).then(function (amount) {
                        scope.amountMembers = amount;
                    });
                }
            }
        };
    }]);