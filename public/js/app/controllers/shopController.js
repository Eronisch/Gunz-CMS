angular.module("revolutionApp").controller('shopController', ['$scope', 'shopService', '$q', 'accountService', '$routeParams', '$location', function ($scope, shopService, $q, accountService, $routeParams, $location) {

    $scope.paging = {
        pageNumber : 1,
        amountItems : 0,
        LIMIT : 12,
        controller : null
    };

    $scope.categories = [];
    $scope.items = [];
    $scope.activeCategoryId = null;
    $scope.shopItemControl = {};
    $scope.account = null;
    $scope.successMessage = null;
    $scope.errorMessage = null;
    $scope.categoryUrl = $routeParams.category;
    $scope.genders = [{name : 'Unisex', value : ''}, {name : 'Male', value : 0}, {name : 'Female', value : 1}];
    $scope.gender = $scope.genders[0];

    getBreadCrumbs();
    getAccount();
    getCategories().then(function (categories) {
        if (categories.length > 0) {
            if ($scope.categoryUrl) {
                for (var i in categories) {
                    if (categories[i].Name === $scope.categoryUrl) {
                        $scope.activeCategoryId = categories[i].Id;
                        break;
                    }
                }
            }

            if (!$scope.activeCategoryId) {
                $scope.activeCategoryId = categories[0].Id;
            }

            getItems();

            $location.search('category', null);
        }
    });

    jQuery('#tabs li a').click(function (e) {
        e.preventDefault();

        jQuery(this).tab('show');
    });

    $scope.getItems = function (categoryId) {
        $scope.categoryUrl = null;
        $scope.activeCategoryId = categoryId;
        $scope.gender = $scope.genders[0];
        $scope.paging.pageNumber = 1;
        $scope.paging.controller.reset();
        getItems(categoryId);
    };

    $scope.filterOnGender = function () {
        $scope.paging.pageNumber = 1;
        $scope.paging.controller.reset();
        getItems($scope.activeCategoryId, $scope.gender.value);
    };

    $scope.onPageNavigation = function(pageNumber){
        $scope.paging.pageNumber = pageNumber;
        getItems();
    };

    $scope.onPurchase = function (data) {
        if (data.isSuccess) {
            $scope.successMessage = 'You have successfully purchased the: ' + data.itemName + '!';
        } else {
            $scope.errorMessage = 'You don\'t have enough donation coins to purchase the: ' + data.itemName + '!';
        }
    };

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Shop",
            links: [
                {
                    title: "Home",
                    link: '/'
                },
                {
                    title: 'Shop'
                }
            ]
        }
    }

    function getCategories() {
        var def = $q.defer();
        shopService.getCategories().then(function (categories) {
            $scope.categories = categories;
            def.resolve(categories);
        });
        return def.promise;
    }

    function getItems() {
        shopService.getItems($scope.activeCategoryId, $scope.gender.value, $scope.paging.pageNumber, $scope.paging.LIMIT).then(function (result) {
            $scope.paging.amountItems = result.amount;
            $scope.items = result.items.map(function(item){
                item.isInSale = function(){
                    return item.NewThirtyDayPrice || item.NewSixtyDayPrice || item.NewUnlimitedPrice;
                };
                item.getPrice = function(){
                    return item.NewThirtyDayPrice ? item.NewThirtyDayPrice : item.ThirtyDayPrice;
                };

                return item;
            });
        });
    }

    function getAccount() {
        accountService.getAccount().then(function (account) {
            $scope.account = account;
        });
    }
}]);