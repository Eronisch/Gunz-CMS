angular.module("revolutionApp").controller('clanRankingController', ['$scope', 'clanService', '$timeout', function ($scope, clanService, $timeout) {

    var page = 1;
    var searchTimeOut = null;
    var AMOUNT_LIMIT = 15;

    $scope.clans = [];
    $scope.search = null;
    $scope.amount = 0;
    $scope.viewingMinimum = 0;
    $scope.viewingMaximum = 0;

    getBreadCrumbs();
    getClans(1);

    $scope.search = function () {
        if (searchTimeOut) {
            $timeout.cancel(searchTimeOut);
        }

        searchTimeOut = $timeout(function () {
            searchClans(page, $scope.searchText);
        }, 400);
    };

    function focus(){
       $timeout(function(){
           jQuery('#searchClanRanking').focus();
       }, 0);
    }

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Clan ranking",
            links: [
                {
                    title: "Home",
                    link: '/'
                },
                {
                    title: 'Clan ranking'
                }
            ]
        }
    }

    function getClans(page) {
        $scope.isLoaded = false;
        clanService.getClanRanking(page, AMOUNT_LIMIT).then(function (result) {
            $scope.clans = result.clans;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
            $scope.isLoaded = true;
            focus();
        });
    }

    function searchClans(page, search) {
        $scope.isLoaded = false;
        clanService.getSearchClanRanking(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.clans = result.clans;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
            $scope.isLoaded = true;
            focus();
        });
    }

    function navigate(pageNumber, event) {
        if($scope.searchText){
            searchClans(pageNumber, $scope.searchText);
        }
        else{
            getClans(pageNumber, false);
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