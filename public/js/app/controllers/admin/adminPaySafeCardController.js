angular.module("revolutionApp").controller('adminPaySafeCardController', ['$scope', 'adminPaySafeCardService', '$timeout', function ($scope, adminPaySafeCardService, $timeout) {

    $scope.payments = [];
    $scope.searchText = null;
    $scope.amount = 0;
    $scope.viewingMinimum = 0;
    $scope.viewingMaximum = 0;
    $scope.acceptPaymentModel = {
        isLoading: false
    };

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

    $scope.openAcceptPaymentModal = function (payment) {
        $scope.acceptPaymentModel = payment;
        jQuery('#acceptPaymentModal').appendTo("body").modal('show');
    };

    $scope.acceptPayment = function () {
        $scope.acceptPaymentModel.isLoading = true;
        adminPaySafeCardService.acceptPayment($scope.acceptPaymentModel.Id).then(function () {
            getPayments(page, $scope.searchText).then(function () {
                jQuery('#acceptPaymentModal').modal('hide');
                $scope.acceptPaymentModel.isLoading = {};
            });
        })
    };

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Paysafecard administration",
            links: [
                {
                    title: "Admin",
                    link: '/admin'
                },
                {
                    title: 'Paysafecard'
                }
            ]
        }
    }

    function getPayments(page, search) {
        return adminPaySafeCardService.searchAll(page, AMOUNT_LIMIT, search).then(function (result) {
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