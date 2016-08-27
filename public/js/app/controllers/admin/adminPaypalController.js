angular.module("revolutionApp").controller('adminPaypalController', ['$scope', 'adminPaypalService', '$timeout', function ($scope, adminPaypalService, $timeout) {

    $scope.search = null;
    $scope.searchText = null;
    $scope.amount = 0;
    $scope.viewingMinimum = 0;
    $scope.viewingMaximum = 0;

    var page = 1;
    var searchTimeOut = null;
    var AMOUNT_LIMIT = 15;

    getBreadCrumbs();
    getPayments(1);

    $scope.search = function () {
        if (searchTimeOut) {
            $timeout.cancel(searchTimeOut);
        }

        searchTimeOut = $timeout(function () {
            getPayments(page, $scope.searchText);
        }, 250);
    };

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "PayPal administration",
            links: [
                {
                    title: "Admin",
                    link: '/admin'
                },
                {
                    title: 'PayPal'
                }
            ]
        }
    }

    function getPayments(page, search) {
        adminPaypalService.getAll(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.payments = result.payments;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
        });
    }

    function navigate(pageNumber, event) {
        getPayments(pageNumber, $scope.searchText);

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