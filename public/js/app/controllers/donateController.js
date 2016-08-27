angular.module("revolutionApp").controller('donateController', ['$scope', 'accountService', 'paySafeCardService', function ($scope, accountService, paySafeCardService) {

    $scope.isLoggedIn = false;
    $scope.isPayPalVisible = true;
    $scope.paySafeCard = {
        isVisible : false,
        paymentOptionId : 1,
        code : null,
        isSubmitting : false,
        isSuccess : false,
        hasSubmitted : false
    };

    getBreadCrumbs();
    getIsLoggedIn();

    $scope.togglePayPal = function () {
        $scope.paySafeCard.isVisible = false;
        $scope.isPayPalVisible = !$scope.isPayPalVisible;
    };

    $scope.togglePaySafeCard = function () {
        $scope.isPayPalVisible = false;
        $scope.paySafeCard.isVisible = !$scope.paySafeCard.isVisible;
    };

    $scope.openPaySafeCardModal = function(paymentOptionId){
        $scope.paySafeCard.paymentOptionId = paymentOptionId;
        jQuery('#paySafeCardModal').appendTo("body").modal('show');
    };

    $scope.purchasePaySafeCard = function(){
        $scope.paySafeCard.isSubmitting = true;
        paySafeCardService.purchase($scope.paySafeCard.paymentOptionId, $scope.paySafeCard.code).then(function(){
            jQuery('#paySafeCardModal').modal('hide');
            $scope.paySafeCard.isSubmitting = false;
            $scope.paySafeCard.isSuccess = true;
            $scope.paySafeCard.hasSubmitted = true;
            $scope.paySafeCard.code = null;
        }).catch(function(){
            jQuery('#paySafeCardModal').modal('hide');
            $scope.paySafeCard.isSubmitting = false;
            $scope.paySafeCard.isSuccess = false;
            $scope.paySafeCard.hasSubmitted = true;
        });
    };

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Donate",
            links: [
                {
                    title: "Home",
                    link: '/'
                },
                {
                    title: 'Donate'
                }
            ]
        }
    }

    function getIsLoggedIn() {
        accountService.isLoggedIn().then(function (isLoggedIn) {
            $scope.isLoggedIn = isLoggedIn;
        });
    }
}]);