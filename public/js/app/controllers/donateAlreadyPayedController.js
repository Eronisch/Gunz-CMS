angular.module("revolutionApp").controller('donateAlreadyPayedController', ['$scope', function ($scope) {

        getBreadCrumbs();

        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "Donate already payed",
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
                        title: 'Already payed'
                    }
                ]
            }
        }
    }]);