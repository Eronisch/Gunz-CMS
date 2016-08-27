angular.module("revolutionApp").directive('header', ['$rootScope', 'accountService', function ($rootScope, accountService) {
    return {
        scope: {},
        restrict: 'E',
        replace: true,
        templateUrl: '/templates/directives/header.html',
        link: function (scope) {

            scope.isLoggedIn = false;

            update();

            $rootScope.$on('accountLogin', function () {
                scope.isLoggedIn = true;
                update();
            });

            jQuery(document).on('click', '#navCollapse li', function(){
                if(jQuery(this).find('.sub-menu').length === 0){
                    jQuery('#navCollapse').collapse('hide');
                }
            });
            
            function update() {
                accountService.getLoggedInUsername().then(function (data) {
                    if (data) {
                        scope.isLoggedIn = true;
                        scope.userName = data.userName;
                    }
                }); 
            }
        }
    };
}]);