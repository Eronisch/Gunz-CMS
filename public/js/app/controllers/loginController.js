angular.module("revolutionApp").controller('loginController', ['$scope', function ($scope) {
         getBreadCrumbs();
        
        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "Login",
                links: [
                    {
                        title: "Home",
                        link: '/'
                    },
                    {
                        title: 'Login'
                    }
                ]
            }
        }

    }]);