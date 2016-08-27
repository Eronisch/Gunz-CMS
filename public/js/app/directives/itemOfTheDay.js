angular.module("revolutionApp").directive('itemoftheday', ['shopService', 'accountService', '$q', '$timeout', '$interval', '$rootScope', function (shopService, accountService, $q, $timeout, $interval, $rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
            onpurchase : '='
        },
        templateUrl: '/templates/directives/itemoftheday.html',
        link: function ($scope) {

            var timerStockUpdater = null;

            $scope.purchaseItemModal = null;
            $scope.item = {};
            $scope.account = null;
            $scope.promiseItemOfTheDay = null;
            $scope.ITEM_PURCHASE_TYPES = [{
                id : shopService.PURCHASE_TYPES.thirtyDays,
                name : '30 Days'
            },{
                id : shopService.PURCHASE_TYPES.sixtyDays,
                name : '60 Days'
            },{
                id : shopService.PURCHASE_TYPES.unlimited,
                name : 'Unlimited'
            }];
            $scope.PURCHASE_STATUS = {
                noItem: 0,
                invalidBalance: 1,
                limitReached: 2,
                unlimitedNotAvailable : 3,
                success: 4
            };

            setItemOfTheDay();

            $scope.openModal = function(){
                jQuery('#itemOfTheDayModal').appendTo("body").addClass('appended').modal('show');
            };

            $scope.purchase = function () {
                $scope.purchaseItemModal.isBuying = true;
                shopService.purchaseItemOfTheDay(parseInt($scope.purchaseItemModal.purchaseType)).then(function (statusCode) {

                    $scope.purchaseItemModal.isBuying = false;

                    $scope.purchaseItemModal.statusCode = statusCode;

                    if(statusCode === $scope.PURCHASE_STATUS.success){
                        $scope.onpurchase();
                        $scope.purchaseItemModal.accountDonationCoins = $scope.purchaseItemModal.getAccountBalanceAfter();
                    }

                    jQuery('#itemOfTheDayModal').modal('hide');

                });
            };

            $scope.onCountDownFinished = function(){
                $scope.purchaseItemModal.hasEnded = true;
                $timeout(function(){
                    setItemOfTheDay();
                }, 3000);
            };

            $rootScope.$on('accountLogin', function () {
                accountService.getAccount().then(function(account){
                    $scope.account = account;
                })
            });

            function setStock(){
                shopService.getStock().then(function(stock){
                    $scope.purchaseItemModal.stock = stock;
                });
            }

            function setItemOfTheDay(){
                $scope.promiseItemOfTheDay = $q.all([shopService.getItemOfTheDay(), accountService.getAccount()]);

                $scope.promiseItemOfTheDay.then(function (values) {
                    $scope.item = values[0];
                    $scope.account = values[1];

                    setItemModalData(values[0], values[1]);

                    if(timerStockUpdater){
                        $interval.cancel(timerStockUpdater);
                    }

                    if($scope.item.LimitAmount != null){
                        timerStockUpdater = $interval(setStock, 3000);
                    }

                    $scope.isLoaded = true;
                });
            }

            function setItemModalData(item, account) {
                $scope.purchaseItemModal = {
                    accountDonationCoins: account.DonationCoins,
                    purchaseType: $scope.ITEM_PURCHASE_TYPES[0].id,
                    isBuying : false,
                    hasEnded : false,
                    item : item,
                    statusCode : null,
                    stock : item.LimitAmount ? item.LimitAmount - item.PurchasedAmount : null,
                    getAccountBalanceAfter: function () {
                        return $scope.purchaseItemModal.accountDonationCoins - $scope.purchaseItemModal.getPrice();
                    },
                    getHasInvalidBalance: function () {
                        return 0 > $scope.purchaseItemModal.getAccountBalanceAfter();
                    },
                    getPrice : function(){
                        switch($scope.purchaseItemModal.getPurchaseType()){
                            case $scope.ITEM_PURCHASE_TYPES[0].id : {
                                return $scope.purchaseItemModal.item.NewThirtyDayPrice ? $scope.purchaseItemModal.item.NewThirtyDayPrice : $scope.purchaseItemModal.item.ThirtyDayPrice
                            }
                            case $scope.ITEM_PURCHASE_TYPES[1].id : {
                                return $scope.purchaseItemModal.item.NewSixtyDayPrice ? $scope.purchaseItemModal.item.NewSixtyDayPrice : $scope.purchaseItemModal.item.SixtyDayPrice
                            }
                            case $scope.ITEM_PURCHASE_TYPES[2].id : {
                                return $scope.purchaseItemModal.item.NewUnlimitedPrice ? $scope.purchaseItemModal.item.NewUnlimitedPrice : $scope.purchaseItemModal.item.UnlimitedPrice
                            }
                        }
                    },
                    isPurchaseTypeDisabled : function(purchaseTypeId){
                        return purchaseTypeId === shopService.PURCHASE_TYPES.unlimited && $scope.purchaseItemModal.item.UnlimitedPrice == null;
                    },
                    getPurchaseType: function () {
                        return parseInt($scope.purchaseItemModal.purchaseType);
                    }
                };
            }
        }
    };
}]);