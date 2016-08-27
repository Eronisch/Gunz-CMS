angular.module("revolutionApp").controller('clanMatchesController', ['$scope', 'clanService', '$q', '$routeParams', function ($scope, clanService, $q, $routeParams) {

    $scope.matches = [];

    $scope.page = 1;

    $scope.clanInfo = {};

    var LIMIT = 10;

    getMatches(1);

    $scope.openInfoModal = function (isWinner, winMembers, loseMembers) {
        $scope.clanInfo.winMembers = winMembers;
        $scope.clanInfo.loseMembers = loseMembers;

        jQuery('#matchCharactersModal').appendTo("body").modal('show');
    };

    $scope.hideMatchCharacters = function () {
        jQuery('#matchCharactersModal').modal('hide');
    };

    function getMatches(page) {
        clanService.getMatches($routeParams.id, page, LIMIT).then(function (result) {
            $scope.matches = result.matches;
            setPagination(page, result.amount);
        });
    }

    function navigate(pageNumber, event) {
        getMatches(pageNumber);
        event.preventDefault();
    }

    function setPagination(page, amount) {
        jQuery(document).find('.pagination').pagination({
            items: amount,
            itemsOnPage: LIMIT,
            currentPage : page,
            paginationClass: 'pagination',
            nextClass: 'next',
            prevClass: 'prev',
            lastClass: 'last',
            firstClass: 'first',
            pageClass: 'page',
            activeClass: 'active',
            disabledClass: 'disabled',
            prevText: '&#171;',
            nextText: '&#187;',
            onPageClick: navigate
        });
    }
}]);