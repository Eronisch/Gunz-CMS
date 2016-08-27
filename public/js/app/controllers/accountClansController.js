angular.module("revolutionApp").controller('accountClansController', ['$scope', 'clanService', 'accountService', function ($scope, clanService, accountService) {
        
        $scope.clans = [];

        getClansFromAccount();
        getBreadCrumbs();

        function getClansFromAccount() {
            accountService.getLoggedInUserId().then(function (accountId) {
                clanService.getClansFromAccount(accountId).then(function(clans) {
                    $scope.clans = clans;
                });
            });
        }

        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "My clans",
                links: [
                    {
                        title: "Home",
                        link: '/'
                    },
                    {
                        title: 'Clans'
                    }
                ]
            }
        }
    
    }]);