angular.module("revolutionApp").controller('donateSuccessController', ['$scope', function ($scope) {

        getBreadCrumbs();

        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "Donate Success",
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
                        title: 'Success'
                    }
                ]
            }
        }
    }]);