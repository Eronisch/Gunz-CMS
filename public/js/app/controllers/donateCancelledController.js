angular.module("revolutionApp").controller('donateCancelledController', ['$scope', function ($scope) {

        getBreadCrumbs();

        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "Donate Cancelled",
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
                        title: 'Cancelled'
                    }
                ]
            }
        }
    }]);