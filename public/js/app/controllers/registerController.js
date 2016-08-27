angular.module("revolutionApp").controller('registerController', ['$scope', '$timeout', '$location', 'accountService', 'messageService', '$sce', 'vcRecaptchaService', '$rootScope', function ($scope, $timeout, $location, accountService, messageService, $sce, vcRecaptchaService, $rootScope) {
        
        var validateUsernameTimer = null;
        var validateEmailTimer = null;
        $scope.isUsernameUnique = false;
        $scope.isCheckingUsernameUnique = false;
        $scope.isCheckingEmailUnique = false;
        $scope.isEmailUnique = false;
        $scope.hasMatchingPasswords = false;
        $scope.submitted = false;
        $scope.isRegistering = false;
        $scope.captcha = null;
        $scope.isValidCaptcha = true;

        getBreadCrumbs();
        
        $scope.registerAccount = function () {
            
            $scope.submitted = true;
            
            $scope.isRegistering = isSuccessFullRegister();
            
            validateCaptcha();
            
            if ($scope.isRegistering) {
                accountService.addAccount($scope.account, vcRecaptchaService.getResponse()).then(function (isCaptchaValid) {
                    if (!isCaptchaValid) {
                        $scope.isRegistering = false;
                        $scope.isValidCaptcha = false;
                        return;
                    }
                    
                    $location.path('/');
                    $rootScope.$emit("accountLogin");
                    messageService.addSuccessMessage("You have successfully registered. You can now login into the server!");
                }).catch(function () {
                    messageService.addErrorMessage("An unknown error occurred while registering, please try again later.");
                });
            }
        };
        
        $scope.OnEmailChange = function () {
            
            if ($scope.registerForm.email.$valid) {
                
                $scope.isCheckingEmailUnique = true;
                
                if (validateEmailTimer) {
                    $timeout.cancel(validateEmailTimer);
                }
                
                validateEmailTimer = $timeout(function () {
                    isEmailUnique().then(function (isUnique) {
                        $scope.isCheckingEmailUnique = false;
                        $scope.isEmailUnique = isUnique;
                    }).catch(function () {
                        $scope.isCheckingEmailUnique = false;
                    });
                }, 500);
            }
        };
        
        $scope.OnUsernameChange = function () {
            
            if ($scope.registerForm.userName.$valid) {
                
                $scope.isCheckingUsernameUnique = true;
                
                if (validateUsernameTimer) {
                    $timeout.cancel(validateUsernameTimer);
                }
                
                validateUsernameTimer = $timeout(function () {
                    isNameUnique().then(function (isUnique) {
                        $scope.isUsernameUnique = isUnique;
                        $scope.isCheckingUsernameUnique = false;
                    }).catch(function () {
                        $scope.isCheckingUsernameUnique = false;
                    });
                }, 500);
            }
        };
        
        $scope.onPasswordChange = function () {
            $scope.hasMatchingPasswords = $scope.account.password === $scope.account.repeatPassword;
        };
        
        $scope.renderHtml = function (html) {
            return $sce.trustAsHtml(html);
        };
        
        function isSuccessFullRegister() {
            return $scope.isUsernameUnique && $scope.isEmailUnique && $scope.hasMatchingPasswords && $scope.registerForm.$valid && vcRecaptchaService.getResponse();
        }
        
        function isEmailUnique() {
            return accountService.isEmailUnique($scope.account.email);
        }
        
        function isNameUnique() {
            return accountService.isUsernameUnique($scope.account.userName);
        }
        
        function validateCaptcha() {
            $scope.isValidCaptcha = vcRecaptchaService.getResponse() != null;
        }
        
        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "Register",
                links: [
                    {
                        title: "Home",
                        link: '/'
                    },
                    {
                        title: 'Register'
                    }
                ]
            }
        }

    }]);