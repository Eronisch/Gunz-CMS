angular.module("revolutionApp").controller('individualRankingController', ['$scope', 'characterService', '$timeout', function ($scope, characterService, $timeout) {

    var page = 1;
    var searchTimeOut = null;
    var AMOUNT_LIMIT = 15;

    $scope.players = [];
    $scope.search = null;
    $scope.amount = 0;
    $scope.viewingMinimum = 0;
    $scope.viewingMaximum = 0;

    getBreadCrumbs();
    getCharacters(1);

    $scope.search = function () {
        if (searchTimeOut) {
            $timeout.cancel(searchTimeOut);
        }

        searchTimeOut = $timeout(function () {
            searchCharacters(page, $scope.searchText);
        }, 400);
    };

    function focus(){
        $timeout(function(){
            jQuery('#searchIndividualRanking').focus();
        }, 0);
    }

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Individual ranking",
            links: [
                {
                    title: "Home",
                    link: '/'
                },
                {
                    title: 'Individual ranking'
                }
            ]
        }
    }

    function getCharacters(page) {
        $scope.isLoaded = false;
        characterService.getPlayerRanking(page, AMOUNT_LIMIT).then(function (result) {
            $scope.players = result.characters;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
            $scope.isLoaded = true;
            focus();
        });
    }

    function searchCharacters(page, search) {
        $scope.isLoaded = false;
        characterService.getSearchPlayerRanking(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.players = result.characters;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
            $scope.isLoaded = true;
            focus();
        });
    }

    function navigate(pageNumber, event) {
        if($scope.searchText){
            searchCharacters(pageNumber, $scope.searchText);
        }
        else{
            getCharacters(pageNumber, $scope.searchText);
        }
        event.preventDefault();
    }

    function setPagination(amountItems, page, limit) {
        jQuery(document).find('.pagination').pagination({
            items: amountItems,
            itemsOnPage: limit,
            currentPage: page,
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

    function setViewingInfo(amount, pageNumber, limit) {
        $scope.amount = amount;
        $scope.viewingMinimum = pageNumber > 1 ? pageNumber * limit - (limit - 1) : 1;
        $scope.viewingMaximum = pageNumber * limit;
    }

}]);