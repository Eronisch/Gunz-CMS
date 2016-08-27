angular.module("revolutionApp").directive('purchaseshopitem', ['shopService', 'accountService', '$q', function (shopService, accountService, $q) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            control: '=',
            onpurchase: '='
        },
        templateUrl: '/templates/directives/purchaseShopItem.html',
        link: function ($scope, elem, attrs) {

            $scope.purchaseItemModal = null;
            $scope.item = null;
            $scope.ITEM_PURCHASE_TYPES = [{
                id: shopService.PURCHASE_TYPES.thirtyDays,
                name: '30 Days'
            }, {
                id: shopService.PURCHASE_TYPES.sixtyDays,
                name: '60 Days'
            }, {
                id: shopService.PURCHASE_TYPES.unlimited,
                name: 'Unlimited'
            }];

            $scope.control.openModal = function (itemId) {
                $q.all([shopService.getItem(itemId), accountService.getAccount()]).then(function (values) {
                    setItemModalData(values[0], values[1]);
                    jQuery('#' + attrs.modalId).appendTo("body").addClass('appended').modal('show');
                });
            };

            $scope.purchase = function (itemId, itemName) {
                $scope.purchaseItemModal.isBuying = true;
                shopService.purchaseItem(itemId, parseInt($scope.purchaseItemModal.purchaseType)).then(function (isSuccess) {

                    jQuery(document).find('#' + attrs.modalId).modal('hide');

                    $scope.purchaseItemModal.isBuying = false;

                    if (isSuccess) {
                        $scope.purchaseItemModal.accountDonationCoins = $scope.purchaseItemModal.getAccountBalanceAfter();
                        $scope.onpurchase({
                            isSuccess: isSuccess,
                            itemName: itemName
                        });
                    }
                });
            };

            function setItemModalData(item, account) {
                $scope.purchaseItemModal = {
                    discount: 0,
                    thirtyDayPrice: item.ThirtyDayPrice,
                    sixtyDayPrice: item.SixtyDayPrice,
                    unlimitedPrice: item.UnlimitedPrice,
                    newThirtyDayPrice: item.NewThirtyDayPrice,
                    newSixtyDayPrice: item.NewSixtyDayPrice,
                    newUnlimitedPrice: item.NewUnlimitedPrice,
                    name: item.Name,
                    description: item.Description,
                    accountDonationCoins: account.DonationCoins,
                    purchaseType: $scope.ITEM_PURCHASE_TYPES[0].id,
                    categoryId: item.CategoryId,
                    image: item.Image,
                    id: item.Id,
                    quantity: item.Quantity,
                    isBuying: false,
                    items: (function () {
                        if (!item.DonatorShopSet) return [];

                        return item.DonatorShopSet.DonatorShopSetItems.map(function (item) {
                            return {
                                id: item.DonatorShopItem.Id,
                                name: item.DonatorShopItem.Name,
                                quantity: item.DonatorShopItem.Quantity
                            }
                        });
                    })(),
                    getPrice: function () {
                        switch ($scope.purchaseItemModal.getPurchaseType()) {
                            case $scope.ITEM_PURCHASE_TYPES[0].id :
                            {
                                return $scope.purchaseItemModal.newThirtyDayPrice ? $scope.purchaseItemModal.newThirtyDayPrice : $scope.purchaseItemModal.thirtyDayPrice
                            }
                            case $scope.ITEM_PURCHASE_TYPES[1].id :
                            {
                                return $scope.purchaseItemModal.newSixtyDayPrice ? $scope.purchaseItemModal.newSixtyDayPrice : $scope.purchaseItemModal.sixtyDayPrice
                            }
                            case $scope.ITEM_PURCHASE_TYPES[2].id :
                            {
                                return $scope.purchaseItemModal.newUnlimitedPrice ? $scope.purchaseItemModal.newUnlimitedPrice : $scope.purchaseItemModal.unlimitedPrice
                            }
                        }
                    },
                    getOldPrice: function () {
                        switch ($scope.purchaseItemModal.getPurchaseType()) {
                            case $scope.ITEM_PURCHASE_TYPES[0].id :
                            {
                                return $scope.purchaseItemModal.thirtyDayPrice;
                            }
                            case $scope.ITEM_PURCHASE_TYPES[1].id :
                            {
                                return $scope.purchaseItemModal.sixtyDayPrice;
                            }
                            case $scope.ITEM_PURCHASE_TYPES[2].id :
                            {
                                return $scope.purchaseItemModal.unlimitedPrice ? $scope.purchaseItemModal.unlimitedPrice : 0;
                            }
                        }
                    },
                    getNewPrice: function () {
                        switch ($scope.purchaseItemModal.getPurchaseType()) {
                            case $scope.ITEM_PURCHASE_TYPES[0].id :
                            {
                                return $scope.purchaseItemModal.newThirtyDayPrice;
                            }
                            case $scope.ITEM_PURCHASE_TYPES[1].id :
                            {
                                return $scope.purchaseItemModal.newSixtyDayPrice;
                            }
                            case $scope.ITEM_PURCHASE_TYPES[2].id :
                            {
                                return $scope.purchaseItemModal.newUnlimitedPrice;
                            }
                        }
                    },
                    isInSale: function () {
                        switch ($scope.purchaseItemModal.getPurchaseType()) {
                            case $scope.ITEM_PURCHASE_TYPES[0].id :
                            {
                                return $scope.purchaseItemModal.newThirtyDayPrice != null;
                            }
                            case $scope.ITEM_PURCHASE_TYPES[1].id :
                            {
                                return $scope.purchaseItemModal.newSixtyDayPrice != null;
                            }
                            case $scope.ITEM_PURCHASE_TYPES[2].id :
                            {
                                return $scope.purchaseItemModal.newUnlimitedPrice != null;
                            }
                        }
                    },
                    getAccountBalanceAfter: function () {
                        return $scope.purchaseItemModal.accountDonationCoins - $scope.purchaseItemModal.getPrice();
                    },
                    getHasInvalidBalance: function () {
                        return 0 > $scope.purchaseItemModal.getAccountBalanceAfter();
                    },
                    getDiscount: function () {
                        if (!$scope.purchaseItemModal.isInSale()) {
                            return 0;
                        }

                        if (!$scope.purchaseItemModal.getOldPrice()) {
                            return 100;
                        }

                        return Math.round((100 / $scope.purchaseItemModal.getOldPrice() * $scope.purchaseItemModal.getNewPrice()));
                    },
                    getThirtyDayPrice: function () {
                        return $scope.purchaseItemModal.newThirtyDayPrice ? $scope.purchaseItemModal.newThirtyDayPrice : $scope.purchaseItemModal.thirtyDayPrice
                    },
                    isPurchaseTypeDisabled: function (purchaseTypeId) {
                        return purchaseTypeId === shopService.PURCHASE_TYPES.unlimited && ($scope.purchaseItemModal.unlimitedPrice == null && $scope.purchaseItemModal.newUnlimitedPrice == null);
                    },
                    getPurchaseType: function () {
                        return parseInt($scope.purchaseItemModal.purchaseType);
                    }
                };
            }
        }
    };
}]);