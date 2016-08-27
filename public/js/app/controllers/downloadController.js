angular.module("revolutionApp").controller('downloadController', ['$scope', function ($scope) {

        getBreadCrumbs();

        function getBreadCrumbs() {
            $scope.breadcrumbs = {
                title: "Download",
                links: [
                    {
                        title: "Home",
                        link: '/'
                    },
                    {
                        title: 'Download'
                    }
                ]
            }
        }

}]);