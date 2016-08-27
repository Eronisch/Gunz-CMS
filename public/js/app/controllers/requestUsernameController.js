angular.module("revolutionApp").controller('requestUsernameController', ['$scope', 'requestUsernameService', 'vcRecaptchaService', function ($scope, requestUsernameService, vcRecaptchaService) {

    $scope.request = {
        email : null,
        isLoading : false,
        isSubmitted : false,
        status : null
    };

    $scope.requestUsername = function(){
        $scope.request.isLoading = true;
        $scope.request.isSubmitted = true;
        requestUsernameService.requestUsername($scope.request.email, vcRecaptchaService.getResponse()).then(function(result){
            $scope.request.isLoading = false;
            $scope.request.status = result;

            if(result === 3){
                $scope.request.email = null;
                vcRecaptchaService.reload();
            }
        }).catch(function(){
            $scope.request.isLoading = false;
            $scope.request.status = 2;
        });
    };

    getBreadCrumbs();

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Request username",
            links: [
                {
                    title: "Home",
                    link: '/'
                },
                {
                    title: 'Request'
                }
            ]
        }
    }
}]);