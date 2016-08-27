angular.module("revolutionApp").controller('donateErrorController', ['$scope', function ($scope) {

        getBreadCrumbs();

        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "Donate Error",
                links: [
                    {
                        title: "Home",
                        link: '/'
                    },
                    {
                        title: "Donate",
                        link: '/donate'
                    },
                    {
                        title: 'Error'
                    }
                ]
            }
        }
    }]);