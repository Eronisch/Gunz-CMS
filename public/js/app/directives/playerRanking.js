angular.module("revolutionApp").directive('playerranking', ['characterService', function (characterService) {
    return {
        scope: {},
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/playerRanking.html',
        link: function ($scope) {
            characterService.getPlayerRanking(1, 5).then(function(playerData) {
                $scope.playerRanking = playerData.characters;
                $scope.isLoaded = true;
            });
        }
    };
}]);