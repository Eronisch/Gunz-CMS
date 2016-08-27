angular.module("revolutionApp").controller('adminAccountController', ['$scope', 'adminAccountService', '$timeout', function ($scope, adminAccountService, $timeout) {

    $scope.accounts = [];
    $scope.search = null;
    $scope.searchText = null;
    $scope.amount = 0;
    $scope.viewingMinimum = 0;
    $scope.viewingMaximum = 0;
    $scope.cash = {
        isLoading: false,
        userId: null,
        cash: null,
        isSuccess: false
    };
    $scope.banModel = {
        userId: null,
        date: null,
        isSuccess: false,
        isLoading : false
    };

    var page = 1;
    var searchTimeOut = null;
    var AMOUNT_LIMIT = 15;

    getBreadCrumbs();
    getAccounts(1);

    $scope.search = function () {
        if (searchTimeOut) {
            $timeout.cancel(searchTimeOut);
        }

        searchTimeOut = $timeout(function () {
            searchAccounts(page, $scope.searchText);
        }, 250);
    };

    $scope.openCashModal = function () {
        jQuery('#cashModal').appendTo("body").modal('show');
    };

    $scope.openBanModal = function () {
        jQuery('#banModal').appendTo("body").modal('show');
    };

    $scope.addCash = function () {
        $scope.cash.isLoading = true;
        adminAccountService.addCash($scope.cash.userId, $scope.cash.cash).then(function (isSuccess) {
            $scope.cash.hasError = !isSuccess;
            if (isSuccess) {
                searchAccounts($scope.page, $scope.searchText).then(function(){
                    jQuery('#cashModal').modal('hide');
                    $scope.cash = {};
                });
            }
            else{
                $scope.cash.isLoading = false;
            }
        });
    };

    $scope.ban = function () {
        $scope.banModel.isLoading = true;
        adminAccountService.ban($scope.banModel.userId, $scope.banModel.date).then(function (isSuccess) {
            $scope.banModel.hasError = !isSuccess;
            if (isSuccess) {
                searchAccounts($scope.page, $scope.searchText).then(function() {
                    jQuery('#banModal').modal('hide');
                    $scope.banModel = {};
                });
            }
            else{
                $scope.banModel.isLoading = false;
            }
        });
    };

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Account administration",
            links: [
                {
                    title: "Admin",
                    link: '/admin'
                },
                {
                    title: 'Account'
                }
            ]
        }
    }

    function getAccounts(page) {
        return adminAccountService.getAll(page, AMOUNT_LIMIT).then(function (result) {
            $scope.accounts = result.accounts;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
        });
    }

    function searchAccounts(page, search) {
        return adminAccountService.searchAll(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.accounts = result.accounts;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
        });
    }

    function navigate(pageNumber, event) {
        if ($scope.searchText) {
            searchAccounts(pageNumber, $scope.searchText);
        }
        else {
            getAccounts(pageNumber);
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