angular.module("revolutionApp").controller('resetPasswordStepTwoController', ['$scope', 'resetPasswordService', 'messageService', '$location', 'vcRecaptchaService', '$routeParams', function ($scope, resetPasswordService, messageService, $location, vcRecaptchaService, $routeParams) {

    $scope.reset = {
        code : null,
        password : null,
        repeatPassword : null,
        isLoading : false,
        isResetted : false,
        status : null
    };

    $scope.resetPassword = function(){
        if($scope.resetPasswordForm.$valid){
            $scope.reset.isLoading = true;
            resetPasswordService.resetPassword($routeParams.code, $scope.reset.password, vcRecaptchaService.getResponse()).then(function(status){
                $scope.reset.isLoading = false;
                $scope.reset.isResetted = true;
                $scope.reset.status = status;

                switch(status){
                    case 1 : {
                        $location.path('/');
                        messageService.addErrorMessage("There is no account with the given reset code.");
                        break;
                    }
                        case 2 : {
                            $location.path('/');
                            messageService.addErrorMessage("Your reset code has been expired.");
                            break;
                        }
                        case 3 : {
                            $location.path('/');
                            messageService.addSuccessMessage("Your password has been successfully updated.");
                            break;
                        }
                }
            });
        }
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
                    title: "Request reset",
                    link: '/reset-password'
                },
                {
                    title: 'Reset'
                }
            ]
        }
    }
}]);