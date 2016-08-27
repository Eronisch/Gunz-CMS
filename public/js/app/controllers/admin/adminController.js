angular.module("revolutionApp").controller('adminController', ['$scope', function ($scope) {

    getBreadCrumbs();

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Administration panel",
            links: [
                {
                    title: "Home",
                    link: '/'
                },
                {
                    title: 'Admin'
                }
            ]
        }
    }

}]);