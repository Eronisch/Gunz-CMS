angular.module("revolutionApp").controller('adminItemOfTheDayController', ['$scope', 'adminItemOfTheDayService', '$timeout', function ($scope, adminItemOfTheDayService, $timeout) {

    $scope.search = null;
    $scope.searchText = null;
    $scope.amount = 0;
    $scope.viewingMinimum = 0;
    $scope.viewingMaximum = 0;

    $scope.addItem = {
        addModel: null,
        isLoading: false
    };

    $scope.editItem = {
        editModel: {},
        isLoading: false
    };

    $scope.deleteItem = {
        deleteModel: {},
        isLoading: false
    };


    var page = 1;
    var searchTimeOut = null;
    var AMOUNT_LIMIT = 15;

    getBreadCrumbs();
    getItems(1);

    $scope.search = function () {
        if (searchTimeOut) {
            $timeout.cancel(searchTimeOut);
        }

        searchTimeOut = $timeout(function () {
            getItems(page, $scope.searchText);
        }, 250);
    };

    $scope.addItemRecord = function () {
        $scope.addItem.isLoading = true;
        adminItemOfTheDayService.addItem($scope.addItem.addModel).then(function () {
            return getItems(1).then(function () {
                jQuery('#addItemOfTheDayModal').modal('hide');
                $scope.addItem.isLoading = false;
                $scope.addItem.addModel = {};
                clearFileInputInAddModal();
            });
        });
    };

    $scope.deleteItemRecord = function(){
        $scope.deleteItem.isLoading = true;
        adminItemOfTheDayService.deleteItem($scope.deleteItem.deleteModel.id).then(function () {
            return getItems(1).then(function () {
                jQuery('#deleteItemOfTheDayModal').modal('hide');
                $scope.deleteItem.isLoading = false;
                $scope.deleteItem.deleteModel = {};
            });
        });
    };

    $scope.openEditItemOfTheDayModal = function (item) {
        $scope.editItem.editModel.id = item.Id;
        $scope.editItem.editModel.name = item.Name;
        $scope.editItem.editModel.description = item.Description;
        $scope.editItem.editModel.itemId = item.ItemId;
        $scope.editItem.editModel.quantity = item.Quantity;
        $scope.editItem.editModel.damage = item.Damage;
        $scope.editItem.editModel.delay = item.Delay;
        $scope.editItem.editModel.magazine = item.Magazine;
        $scope.editItem.editModel.maxBullet = item.MaxBullet;
        $scope.editItem.editModel.maxWeight = item.MaxWeight;
        $scope.editItem.editModel.reloadTime = item.ReloadTime;
        $scope.editItem.editModel.hp = item.Hp;
        $scope.editItem.editModel.ap = item.Ap;
        $scope.editItem.editModel.sex = item.Sex;
        $scope.editItem.editModel.weight = item.Weight;
        $scope.editItem.editModel.thirtyDayPrice = item.ThirtyDayPrice;
        $scope.editItem.editModel.sixtyDayPrice = item.SixtyDayPrice;
        $scope.editItem.editModel.unlimitedPrice = item.UnlimitedPrice;

        $scope.editItem.editModel.limitAmount = item.LimitAmount;
        $scope.editItem.editModel.date = item.Date;
        jQuery('#editItemOfTheDayModal').appendTo("body").modal('show');
    };

    $scope.openDeleteItemOfTheDayModal = function (item) {
        $scope.deleteItem.deleteModel.id = item.Id;
        $scope.deleteItem.deleteModel.name = item.Name;
        $scope.deleteItem.deleteModel.date = item.Date;
        jQuery('#deleteItemOfTheDayModal').appendTo("body").modal('show');
    };

    $scope.editItemRecord = function () {
        $scope.editItem.isLoading = true;

        if (!$scope.editItem.editModel.sex) {
            delete $scope.editItem.editModel.sex;
        }

        adminItemOfTheDayService.editItem($scope.editItem.editModel.id, $scope.editItem.editModel).then(function () {
            return getItems().then(function () {
                jQuery('#editItemOfTheDayModal').modal('hide');
                $scope.editItem.isLoading = false;
                $scope.editItem.editModel = {};
            });
        });
    };

    $scope.openAddItemOfTheDayModal = function () {
        jQuery('#addItemOfTheDayModal').appendTo("body").modal('show');
    };

    $scope.onAddImageChange = function (event) {
        $scope.$apply(function () {
            if (event.target.files.length > 0) {
                $scope.addItem.addModel.image = event.target.files[0];
            }
        });
    };

    $scope.onEditImageChange = function (event) {
        $scope.$apply(function () {
            if (event.target.files.length > 0) {
                $scope.editItem.editModel.image = event.target.files[0];
            }
        });
    };

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Item of the day administration",
            links: [
                {
                    title: "Admin",
                    link: '/admin'
                },
                {
                    title: 'Item of the day'
                }
            ]
        }
    }

    function clearFileInputInAddModal() {
        jQuery('#fileImage').val(null);
    }

    function getItems(page, search) {
        return adminItemOfTheDayService.getAll(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.items = result.items;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
        });
    }

    function navigate(pageNumber, event) {
        getItems(pageNumber, $scope.searchText);

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