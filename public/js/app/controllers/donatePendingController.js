angular.module("revolutionApp").controller('donatePendingController', ['$scope', function ($scope) {

        getBreadCrumbs();

        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "Donate Pending",
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
                        title: 'Pending'
                    }
                ]
            }
        }
    }]);