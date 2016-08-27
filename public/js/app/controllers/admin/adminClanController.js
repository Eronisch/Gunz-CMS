angular.module("revolutionApp").controller('adminClanController', ['$scope', 'adminClanService', '$timeout', function ($scope, adminClanService, $timeout) {

    $scope.search = null;
    $scope.searchText = null;
    $scope.amount = 0;
    $scope.viewingMinimum = 0;
    $scope.viewingMaximum = 0;

    var page = 1;
    var searchTimeOut = null;
    var AMOUNT_LIMIT = 15;

    getBreadCrumbs();
    getClans(1);

    $scope.search = function () {
        if (searchTimeOut) {
            $timeout.cancel(searchTimeOut);
        }

        searchTimeOut = $timeout(function () {
            getClans(page, $scope.searchText);
        }, 250);
    };

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Clan administration",
            links: [
                {
                    title: "Admin",
                    link: '/admin'
                },
                {
                    title: 'Clan'
                }
            ]
        }
    }

    function getClans(page, search) {
        adminClanService.getAll(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.clans = result.clans;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
        });
    }

    function navigate(pageNumber, event) {
        getClans(pageNumber, $scope.searchText);

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