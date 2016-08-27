angular.module("revolutionApp").controller('resetPasswordController', ['$scope', 'resetPasswordService', 'vcRecaptchaService', '$location', 'messageService', function ($scope, resetPasswordService, vcRecaptchaService, $location, messageService) {

    $scope.reset = {
        email : null,
        isLoading : false,
        isSubmitted : false,
        status : null
    };

    $scope.resetPassword = function(){
        $scope.reset.isLoading = true;
        $scope.reset.isSubmitted = true;
        resetPasswordService.sendResetPasswordLink($scope.reset.email, vcRecaptchaService.getResponse()).then(function(result){
            $scope.reset.isLoading = false;
            $scope.reset.status = result;

            if(result === 3){
                messageService.addSuccessMessage('We have send you a link where you can reset your password.');
                $location.path('/');
            }
        }).catch(function(){
            $scope.reset.isLoading = false;
            $scope.reset.status = 2;
        });
    };

    getBreadCrumbs();

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Reset password",
            links: [
                {
                    title: "Home",
                    link: '/'
                },
                {
                    title: 'Reset'
                }
            ]
        }
    }
}]);