angular.module("revolutionApp").controller('accountController', ['$scope', 'accountService', '$location', '$timeout', 'messageService', 'fileService', function ($scope, accountService, $location, $timeout, messageService, fileService) {
        
        $scope.isUpdatingAccount = false;
        $scope.submitted = false;
        $scope.isValidPassword = true;
        $scope.isValidRepeatPassword = true;
        $scope.hasMatchingPasswords = true;
        $scope.isValidAvatar = false;
        $scope.isEmailUnique = true;
        $scope.isValidAvatar = true;
        $scope.editAccount = {
            password: null,
            repeatPassword: null,
            email: null,
            file : null
        };
        $scope.accountId = null;
        $scope.avatarFileName = "Select avatar";
        
        var isCheckingEmail = false;
        var validateEmailTimer = null;

        loadAccountInfo();
        getBreadCrumbs();
        
        $scope.updateAccount = function () {
            $scope.submitted = true;
            var avatarValidationResult = accountService.validateAvatar($scope.editAccount.file);
            if ($scope.isValidPassword && $scope.isValidRepeatPassword && $scope.hasMatchingPasswords && !isCheckingEmail && (avatarValidationResult === fileService.imageStatus.Success || avatarValidationResult === fileService.imageStatus.NoImage)) {
                $scope.isUpdatingAccount = true;
                accountService.updateAccount($scope.accountId, $scope.editAccount.email, $scope.editAccount.password, $scope.editAccount.repeatPassword, $scope.editAccount.file).then(function (data) {
                    $location.path('/');
                    messageService.addSuccessMessage("Your account has been updated.");
                }).catch(function () {
                    $scope.isUpdatingAccount = false;
                    messageService.addErrorMessage("An error occurred while updating your account, please try again later.");
                });
            }
        };
        
        $scope.onEmailChange = function () {
            if ($scope.editForm.email.$valid) {
                
                isCheckingEmail = true;
                
                if (validateEmailTimer) {
                    $timeout.cancel(validateEmailTimer);
                }
                
                validateEmailTimer = $timeout(function () {
                    accountService.isEmailUnique($scope.editAccount.email).then(function (isUnique) {
                        isCheckingEmail = false;
                        $scope.isEmailUnique = isUnique;
                    }).catch(function () {
                        isCheckingEmail = false;
                    });
                }, 500);
            }
        };
        
        $scope.onPasswordChange = function () {
            $scope.hasMatchingPasswords = $scope.editAccount.password === $scope.editAccount.repeatPassword;
            $scope.isValidPassword = $scope.editAccount.password.length === 0 || ($scope.editAccount.password.length >= 5 && $scope.editAccount.password.length <= 20);
        };
        
        $scope.onPasswordRepeatChange = function () {
            $scope.hasMatchingPasswords = $scope.editAccount.password === $scope.editAccount.repeatPassword;
            $scope.isValidRepeatPassword = $scope.editAccount.repeatPassword.length === 0 || ($scope.editAccount.repeatPassword.length >= 5 && $scope.editAccount.repeatPassword.length <= 20);
        };
        
        $scope.openAvatarSelect = function() {
            jQuery('#avatarFile').click();
        }
        
        $scope.onAvatarChange = function (event) {
            $scope.$apply(function() {
                if (event.target.files.length > 0) {
                    $scope.avatarFileName = event.target.files[0].name;
                    $scope.editAccount.file = event.target.files[0];

                    var avatarValidationResult = accountService.validateAvatar(event.target.files[0]);
                    if (avatarValidationResult === fileService.imageStatus.Success || avatarValidationResult === fileService.imageStatus.NoImage) {
                        $scope.isValidAvatar = true;
                    } else {
                        $scope.isValidAvatar = false;
                    }

                } else {
                    $scope.avatarFileName = "Select avatar";
                    $scope.editAccount.file = null;
                    $scope.isValidAvatar = true;
                }
            });
        }
        
        function loadAccountInfo() {
            accountService.getAccount().then(function (account) {
                $scope.editAccount.email = account.Email;
                $scope.accountId = account.AID;
            });
        }

        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "Edit account",
                links: [
                    {
                        title: "Home",
                        link: '/'
                    },
                    {
                        title: 'Edit account'
                    }
                ]
            }
        }
    }]);