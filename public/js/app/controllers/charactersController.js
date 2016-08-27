angular.module("revolutionApp").controller('charactersController', ['$scope', 'characterService', '$routeParams', function ($scope, characterService, $routeParams) {

       $scope.openDeleteModal = function() {
            jQuery('#deleteCharacterModal').appendTo("body").modal('show');
        }

    }]);