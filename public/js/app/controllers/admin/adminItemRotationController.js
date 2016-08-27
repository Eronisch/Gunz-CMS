angular.module("revolutionApp").controller('adminItemRotationController', ['$scope', 'adminItemRotationService', function ($scope, adminItemRotationService) {

    $scope.selectRotation = {
        years: [],
        months: [],
        model: {
            year: null,
            month: null
        },
        addModel : {
            itemId : null,
            year : null,
            month : null
        },
        deleteItem : null,
        items: [],
        isLoading : false
    };

    $scope.changeFilter = function () {
       return adminItemRotationService.getItems($scope.selectRotation.model.year, getSelectedMonthIndex($scope.selectRotation.model.month)).then(function (items) {
            $scope.selectRotation.items = items;
        });
    };

    $scope.deleteItem = function(id){
        $scope.selectRotation.isLoading = true;
        adminItemRotationService.deleteItem(id)
            .then($scope.changeFilter)
            .then(function(){
                jQuery('#deleteItemModal').modal('hide');
                $scope.selectRotation.isLoading = false;
        })
    };

    $scope.showConfirmDelete = function(item){
        $scope.selectRotation.deleteItem = item;
        jQuery('#deleteItemModal').appendTo("body").modal('show');
    };

    $scope.showAddModal = function(){
        jQuery('#addItemRotation').appendTo("body").modal('show');
    };

    $scope.addItem = function(){
        $scope.selectRotation.isLoading = true;
        adminItemRotationService.addItem($scope.selectRotation.addModel.itemId, $scope.selectRotation.addModel.year, getSelectedMonthIndex($scope.selectRotation.addModel.month))
            .then($scope.changeFilter)
            .then(function(){
                jQuery('#addItemRotation').modal('hide');
                $scope.selectRotation.isLoading = false;
                $scope.selectRotation.addModel = {};
                initAddModel();
            })
    };

    init();
    setBreadCrumbs();

    function init() {
        initYears();
        initMonths();
        initModel();
        initAddModel();
        $scope.changeFilter();
    }

    function initYears() {
        var currentDateTime = new Date();

        for (var i = -5; 6 > i; i++) {
            $scope.selectRotation.years.push(currentDateTime.getFullYear() + i);
        }
    }

    function initMonths() {
        $scope.selectRotation.months = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];
    }

    function initModel() {
        var currentDateTime = new Date();

        $scope.selectRotation.model.year = currentDateTime.getFullYear();
        $scope.selectRotation.model.month = $scope.selectRotation.months[currentDateTime.getMonth()];
    }

    function initAddModel(){
        var currentDateTime = new Date();

        $scope.selectRotation.addModel.year = currentDateTime.getFullYear();
        $scope.selectRotation.addModel.month = $scope.selectRotation.months[currentDateTime.getMonth()];
    }

    function setBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Item rotation administration",
            links: [
                {
                    title: "Admin",
                    link: '/admin'
                },
                {
                    title: 'Item rotation'
                }
            ]
        }
    }

    function getSelectedMonthIndex(selectedModel){
        for(var i = 0; $scope.selectRotation.months.length > i; i++){
            if($scope.selectRotation.months[i] === selectedModel){
                return i;
            }
        }
    }

}]);