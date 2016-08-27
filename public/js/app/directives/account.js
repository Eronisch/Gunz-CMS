angular.module("revolutionApp").directive('account', ['accountService', '$window', '$rootScope', '$location', function (accountService, $window, $rootScope, $location) {
    return {
        scope: {
            control: '=?'
        },
        restrict: 'E',
        replace: true,
        template: '<div class="widget" ng-include="templateUrl"></div>',
        link: function (scope) {

            scope.isLoggingIn = false;
            scope.isLoggingOut = false;
            scope.templateUrl = null;
            scope.loginResult = null;
            scope.loginSubmitted = false;
            scope.control = scope.control || {};
            scope.loginTypes = accountService.loginTypes;
            scope.loginModel = {
                username: null,
                password: null
            };

            initialize();

            scope.logOut = function () {
                scope.isLoggingOut = true;
                accountService.logOut().then(function () {
                    scope.isLoggingOut = false;
                    $window.location.reload();
                });
            };

            scope.control.refresh = function () {
                initialize();
            };

            scope.login = function () {
                scope.isLoggingIn = true;
                scope.loginSubmitted = true;

                accountService.login(scope.loginModel.username, scope.loginModel.password).then(function (loginResult) {
                    scope.isLoggingIn = false;
                    if (loginResult === scope.loginTypes.success) {
                        $location.path('/');
                        $rootScope.$emit("accountLogin");
                    }

                    scope.loginResult = loginResult;
                });
            };

            $rootScope.$on("accountLogin", function () {
                initialize();
            });

            function initialize() {
                accountService.getAccount().then(function (account) {
                    if (account) {
                        scope.account = account;
                        setAccountTemplate();
                        scope.isLoaded = true;
                    } else {
                        setLoginTemplate();
                        scope.isLoaded = true;
                    }
                });
            }

            function setLoginTemplate() {
                scope.templateUrl = "/templates/directives/login.html";
            }

            function setAccountTemplate() {
                scope.templateUrl = "/templates/directives/account.html";
            }
        }
    };
}]);