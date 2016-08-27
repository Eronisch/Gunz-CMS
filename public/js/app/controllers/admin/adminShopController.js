angular.module("revolutionApp").controller('adminShopController', ['$scope', 'adminShopService', '$timeout', function ($scope, adminShopService, $timeout) {

    $scope.donatorCategories = {
        amount: 0,
        viewingMinimum: 0,
        viewingMaximum: 0,
        page: 1,
        searchText: null,
        searchTimeOut: null,
        categories: [],
        addModel: {},
        editModel: {},
        deleteModel: {},
        isLoading: false
    };

    $scope.donatorItems = {
        amount: 0,
        viewingMinimum: 0,
        viewingMaximum: 0,
        page: 1,
        searchText: null,
        searchTimeOut: null,
        items: [],
        addModel: {},
        editModel: {},
        deleteModel: {},
        addSetModel: {},
        editSetModel: {},
        deleteSetModel: {},
        modalCategories: [],
        isLoading: false
    };

    $scope.donatorSets = {
        items: [],
        sets: [],
        amount: 0,
        viewingMinimum: 0,
        viewingMaximum: 0,
        page: 1,
        searchText: null
    };

    $scope.TAB_NAVIGATION_TYPES = {
        items: 0,
        categories: 1,
        sets: 2
    };

    $scope.activeTab = $scope.TAB_NAVIGATION_TYPES.items;

    var AMOUNT_LIMIT = 10;

    getBreadCrumbs();
    getCategories(1);
    getItems(1);
    getSets(1);
    setItemsInSetModal();
    setItemCategoriesInModal();

    $scope.navigateToTab = function (tabToNavigate) {
        $scope.activeTab = tabToNavigate;
    };

    $scope.openDeleteSetModal = function (set) {
        $scope.donatorItems.deleteSetModel = set;
        jQuery('#deleteSetModal').appendTo("body").modal('show');
    };

    $scope.openEditSetModal = function (set) {
        $scope.donatorItems.editSetModel = {
            name: set.Name,
            id: set.DonatorShopSet.Id,
            items: [],
            itemIds: getItemIdsFromSet(set)
        };

        var copiedItems = [];

        angular.copy($scope.donatorSets.items, copiedItems);

        copiedItems.forEach(function (item) {
            $scope.donatorItems.editSetModel.items.push({
                id: item.Id,
                name: item.Name,
                isSelected: item.isSelected = $scope.donatorItems.editSetModel.itemIds.indexOf(item.Id) > -1
            });
        });

        jQuery('#editSetModal').appendTo("body").modal('show');
    };

    $scope.openAddItemModal = function () {
        jQuery('#addItemModal').appendTo("body").modal('show');
    };

    $scope.openAddCategoryModal = function () {
        jQuery('#addCategoryModal').appendTo("body").modal('show');
    };

    $scope.openEditCategoryModal = function (item) {
        $scope.donatorCategories.editModel.name = item.Name;
        $scope.donatorCategories.editModel.id = item.Id;
        jQuery('#editCategoryModal').appendTo("body").modal('show');
    };

    $scope.searchItems = function () {
        if ($scope.donatorItems.searchTimeOut) {
            $timeout.cancel($scope.donatorItems.searchTimeOut);
        }

        $scope.donatorItems.searchTimeOut = $timeout(function () {
            getItems($scope.donatorItems.page, $scope.donatorItems.searchText);
        }, 250);
    };

    $scope.showConfirmDeleteCategory = function (category) {
        $scope.donatorCategories.deleteModel = category;
        jQuery('#deleteCategoryModal').appendTo("body").modal('show');
    };

    $scope.showConfirmDeleteItem = function (item) {
        $scope.donatorItems.deleteModel = item;
        jQuery('#deleteItemModal').appendTo("body").modal('show');
    };

    $scope.openAddSetModel = function () {
        jQuery('#addSetModal').appendTo("body").modal('show');
    };

    $scope.deleteCategory = function (id) {
        $scope.donatorCategories.isLoading = true;
        adminShopService.deleteCategory(id).then(function () {
            return Promise.all([getCategories($scope.donatorCategories.page, $scope.donatorCategories.searchText), getItems($scope.donatorItems.page, $scope.donatorItems.searchText)]);
        }).then(function () {
            jQuery('#deleteCategoryModal').modal('hide');
            $scope.donatorCategories.isLoading = false;
            $scope.donatorCategories.deleteModel = null;
        })
    };

    $scope.deleteItem = function (id) {
        $scope.donatorItems.isLoading = true;
        adminShopService.deleteItem(id).then(function () {
            return getItems($scope.donatorItems.page, $scope.donatorItems.searchText);
        }).then(setItemsInSetModal).then(function () {
            jQuery('#deleteItemModal').modal('hide');
            $scope.donatorItems.isLoading = false;
            $scope.donatorItems.deleteModel = null;
        })
    };

    $scope.addSetRecord = function () {
        $scope.donatorItems.isLoading = true;
        adminShopService.addSet($scope.donatorItems.addSetModel.setId, $scope.donatorItems.addSetModel.itemIds).then(function () {
            getSets($scope.donatorSets.page, $scope.donatorSets.search).then(function () {
                jQuery('#addSetModal').modal('hide');
                $scope.donatorItems.addSetModel = {};
                $scope.donatorItems.isLoading = false;
            });
        });
    };

    $scope.deleteSetRecord = function () {
        $scope.donatorItems.isLoading = true;
        adminShopService.deleteSet($scope.donatorItems.deleteSetModel.DonatorShopSet.Id).then(function () {
            getSets($scope.donatorSets.page, $scope.donatorSets.search).then(function () {
                jQuery('#deleteSetModal').modal('hide');
                $scope.donatorItems.addSetModel = {};
                $scope.donatorItems.isLoading = false;
            });
        });
    };

    $scope.searchCategories = function () {
        if ($scope.donatorCategories.searchTimeOut) {
            $timeout.cancel($scope.donatorCategories.searchTimeOut);
        }

        $scope.donatorCategories.searchTimeOut = $timeout(function () {
            getCategories($scope.donatorCategories.page, $scope.donatorCategories.searchText);
        }, 250);
    };

    $scope.searchSets = function () {
        if ($scope.donatorSets.searchTimeOut) {
            $timeout.cancel($scope.donatorSets.searchTimeOut);
        }

        $scope.donatorSets.searchTimeOut = $timeout(function () {
            getSets($scope.donatorSets.page, $scope.donatorSets.searchText);
        }, 250);
    };

    $scope.editCategoryRecord = function () {
        $scope.donatorCategories.isLoading = true;

        adminShopService.updateCategory($scope.donatorCategories.editModel.id, $scope.donatorCategories.editModel.name).then(function () {
            Promise.all([getCategories($scope.donatorCategories.page, $scope.donatorCategories.searchText), setItemCategoriesInModal()]).then(function () {
                $scope.donatorCategories.isLoading = false;
                $scope.donatorCategories.editModel = {};
                jQuery('#editCategoryModal').modal('hide');
            });
        })
    };

    $scope.addCategoryRecord = function () {
        $scope.donatorCategories.isLoading = true;

        adminShopService.addCategory($scope.donatorCategories.addModel.name).then(function () {
            Promise.all([getCategories($scope.donatorCategories.page, $scope.donatorCategories.searchText), setItemCategoriesInModal()]).then(function () {
                $scope.donatorCategories.isLoading = false;
                $scope.donatorCategories.addModel = {};
                jQuery('#addCategoryModal').modal('hide');
            });
        })
    };

    $scope.addItemRecord = function () {
        $scope.donatorItems.isLoading = true;

        adminShopService.addItem($scope.donatorItems.addModel).then(function () {
            getItems($scope.donatorItems.page, $scope.donatorItems.searchText).then(function () {
                $scope.donatorItems.addModel = {};
                clearFileInputInAddModal();

                return Promise.all([setItemsInSetModal(), setItemCategoriesInModal()]);
            }).then(function () {
                jQuery('#addItemModal').modal('hide');
                $scope.donatorItems.isLoading = false;
            });
        })
    };

    $scope.editItemRecord = function () {
        $scope.donatorItems.isLoading = true;

        if (!$scope.donatorItems.editModel.sex) {
            delete $scope.donatorItems.editModel.sex;
        }

        adminShopService.editItem($scope.donatorItems.editModel).then(function () {
            getItems($scope.donatorItems.page, $scope.donatorItems.searchText).then(setItemsInSetModal).then(function () {
                $scope.donatorItems.isLoading = false;
                $scope.donatorItems.editModel = {};
                jQuery('#editItemModal').modal('hide');
            });
        })
    };

    $scope.editSetRecord = function () {
        $scope.donatorItems.isLoading = true;
        adminShopService.updateSet($scope.donatorItems.editSetModel.id, $scope.donatorItems.editSetModel.itemIds).then(function () {
            getSets($scope.donatorSets.page, $scope.donatorSets.searchText).then(function () {
                jQuery('#editSetModal').modal('hide');
                $scope.donatorItems.isLoading = false;
                $scope.donatorItems.editSetModel = {};
            });
        });
    };

    $scope.editItem = function (item) {
        $scope.donatorItems.editModel.id = item.Id;
        $scope.donatorItems.editModel.name = item.Name;
        $scope.donatorItems.editModel.description = item.Description;
        $scope.donatorItems.editModel.itemId = item.ItemId;
        $scope.donatorItems.editModel.quantity = item.Quantity;
        $scope.donatorItems.editModel.damage = item.Damage;
        $scope.donatorItems.editModel.delay = item.Delay;
        $scope.donatorItems.editModel.magazine = item.Magazine;
        $scope.donatorItems.editModel.maxBullet = item.MaxBullet;
        $scope.donatorItems.editModel.maxWeight = item.MaxWeight;
        $scope.donatorItems.editModel.reloadTime = item.ReloadTime;
        $scope.donatorItems.editModel.hp = item.Hp;
        $scope.donatorItems.editModel.ap = item.Ap;
        $scope.donatorItems.editModel.sex = item.Sex;
        $scope.donatorItems.editModel.weight = item.Weight;
        $scope.donatorItems.editModel.thirtyDayPrice = item.ThirtyDayPrice;
        $scope.donatorItems.editModel.sixtyDayPrice = item.SixtyDayPrice;
        $scope.donatorItems.editModel.unlimitedPrice = item.UnlimitedPrice;
        $scope.donatorItems.editModel.newThirtyDayPrice = item.NewThirtyDayPrice;
        $scope.donatorItems.editModel.newSixtyDayPrice = item.NewSixtyDayPrice;
        $scope.donatorItems.editModel.newUnlimitedPrice = item.NewUnlimitedPrice;

        $scope.donatorItems.editModel.category = item.CategoryId;
        jQuery('#editItemModal').appendTo("body").modal('show');
    };

    $scope.onAddImageChange = function (event) {
        $scope.$apply(function () {
            if (event.target.files.length > 0) {
                $scope.donatorItems.addModel.image = event.target.files[0];
            }
        });
    };

    $scope.onEditImageChange = function (event) {
        $scope.$apply(function () {
            if (event.target.files.length > 0) {
                $scope.donatorItems.editModel.image = event.target.files[0];
            }
        });
    };

    function clearFileInputInAddModal() {
        jQuery('#fileImage').val(null);
    }

    function getSets(page, search) {
        return adminShopService.getSets(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.donatorSets.sets = result.sets;
            setPagination('donatorSetPagination', result.amount, page, AMOUNT_LIMIT, onSetNavigate);

            $scope.donatorSets.amount = result.amount;
            $scope.donatorSets.viewingMinimum = page > 1 ? page * AMOUNT_LIMIT - (AMOUNT_LIMIT - 1) : 1;
            $scope.donatorSets.viewingMaximum = page * AMOUNT_LIMIT;
        });
    }

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Shop administration",
            links: [
                {
                    title: "Admin",
                    link: '/admin'
                },
                {
                    title: 'Shop'
                }
            ]
        }
    }

    function setItemsInSetModal() {
        adminShopService.getItems().then(function (result) {
            $scope.donatorSets.items = result.items;
        })
    }

    function setItemCategoriesInModal() {
        adminShopService.getCategories().then(function (result) {
            $scope.donatorItems.modalCategories = result.categories;

            if (result.categories.length > 0) {
                $scope.donatorItems.addModel.category = result.categories[0].Id;
            }
        })
    }

    function getItems(page, search) {
        return adminShopService.getItems(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.donatorItems.items = result.items;
            setPagination('donatorItemPagination', result.amount, page, AMOUNT_LIMIT, onItemNavigate);

            $scope.donatorItems.amount = result.amount;
            $scope.donatorItems.viewingMinimum = page > 1 ? page * AMOUNT_LIMIT - (AMOUNT_LIMIT - 1) : 1;
            $scope.donatorItems.viewingMaximum = page * AMOUNT_LIMIT;
        });
    }

    function getCategories(page, search) {
        return adminShopService.getCategories(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.donatorCategories.categories = result.categories;
            setPagination('donatorCategoryPagination', result.amount, page, AMOUNT_LIMIT, onCategoryNavigate);
            $scope.donatorCategories.amount = result.amount;
            $scope.donatorCategories.viewingMinimum = page > 1 ? page * AMOUNT_LIMIT - (AMOUNT_LIMIT - 1) : 1;
            $scope.donatorCategories.viewingMaximum = page * AMOUNT_LIMIT;
        });
    }

    function onCategoryNavigate(pageNumber, event) {
        getCategories(pageNumber, $scope.donatorCategories.searchText);
        event.preventDefault();
    }

    function onItemNavigate(pageNumber, event) {
        getItems(pageNumber, $scope.donatorItems.searchText);
        event.preventDefault();
    }

    function onSetNavigate(pageNumber, event) {
        getSets(pageNumber, $scope.donatorSets.searchText);
        event.preventDefault();
    }

    function getItemIdsFromSet(set) {
        return set.DonatorShopSet.DonatorShopSetItems.map(function (item) {
            return item.DonatorShopItem.Id;
        })
    }

    function setPagination(id, amountItems, page, limit, navigateCallback) {
        jQuery(document).find('#' + id).pagination({
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
            onPageClick: navigateCallback
        });
    }

}]);