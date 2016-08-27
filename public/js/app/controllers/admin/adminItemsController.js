angular.module("revolutionApp").controller('adminItemsController', ['$scope', 'adminItemService', function ($scope, adminItemService) {

    getBreadCrumbs();

    $scope.item = {
        username : null,
        itemId : null,
        quantity : null,
        days : null
    };

    $scope.isSending = false;
    $scope.hasSend = false;
    $scope.isSuccess = false;

    $scope.sendItem = function(){
        $scope.isSending = true;
        adminItemService.sendItem($scope.item.username, $scope.item.itemId, $scope.item.quantity, $scope.item.days).then(function(isSuccess){
            $scope.isSuccess = isSuccess;
            $scope.hasSend = true;
            $scope.isSending = false;

            if(isSuccess){
                $scope.item.username = null;
                $scope.item.itemId = null;
                $scope.item.quantity = null;
                $scope.item.isForever = false;
                $scope.item.days = null;
            }
        });
    };

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Item administration",
            links: [
                {
                    title: "Admin",
                    link: '/admin'
                },
                {
                    title: 'Items'
                }
            ]
        }
    }
}]);