angular.module("revolutionApp").controller('shopItemController', ['$scope', 'shopService', '$q', 'accountService', '$routeParams', function ($scope, shopService, $q, accountService, $routeParams) {
        
        $scope.account = null;
        $scope.donator = null;
        $scope.itemId = null;
        $scope.shopItemControl = {};
        $scope.accountControl = {};
        $scope.isHorizontalImage = false;
        
        getItem().then(function(item) {
            getCategory(item);
            getIsHorizontalItem();
        });
        getAccount();
        
        $scope.onPurchase = function (data) {
            if (data.isSuccess) {
                $scope.accountControl.refresh();
                $scope.successMessage = 'You have successfully purchased the: ' + data.itemName + '!';
            } else {
                $scope.errorMessage = 'You don\'t have enough donation coins to purchase the: ' + data.itemName + '!';
            }
        };
        
        function getIsHorizontalItem() {
            var element = jQuery('#shopItem');

            element.bind('load', function() {
                $scope.$apply(function() {
                    $scope.isHorizontalImage = element.width() > element.height();
                });
            });
        }
        
        function getAccount() {
            accountService.getAccount().then(function (account) {
                $scope.account = account;
            });
        }
        
        function getItem() {
            var def = $q.defer();
            shopService.getItem($routeParams.id).then(function (item) {
                $scope.donator = item;
                $scope.donator.getThirtyDayPrice = function (){
                    return item.NewThirtyDayPrice ? item.NewThirtyDayPrice : item.ThirtyDayPrice;
                };

                $scope.donator.items = [];

                if(item.DonatorShopSet != null){
                    $scope.donator.items = item.DonatorShopSet.DonatorShopSetItems.map(function(item){
                        item.DonatorShopItem.isInSale = function(){
                            return item.DonatorShopItem.NewThirtyDayPrice || item.DonatorShopItem.NewSixtyDayPrice || item.DonatorShopItem.NewUnlimitedPrice;
                        };
                        item.DonatorShopItem.getPrice = function(){
                            return item.DonatorShopItem.NewThirtyDayPrice ? item.DonatorShopItem.NewThirtyDayPrice : item.DonatorShopItem.thirtyDayPrice;
                        };
                        return item.DonatorShopItem;
                    });
                }

                def.resolve(item);
            });
            return def.promise;
        }
        
        function getCategory(donator) {
            shopService.getCategory(donator.CategoryId).then(function (category) {
                $scope.category = category;
                $scope.breadcrumbs = {
                    title: "Donator Item",
                    links: [
                        {
                            title: "Home",
                            link: '/'
                        },
                        {
                            title: 'Shop',
                            link : '/shop'
                        },
                        {
                            title: category.Name,
                            link : '/shop?category=' + category.Name
                        },
                        {
                            title : donator.Name
                        }
                    ]
                }
            });
        }
    }]);