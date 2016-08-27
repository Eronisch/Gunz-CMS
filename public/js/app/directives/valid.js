angular.module("revolutionApp").directive('valid', function () {

    return {
        restrict: 'E',
        replace: true,
        scope: {
            status: "="
        },
        link: function (scope, elem, attrs) {
            scope.$watch('status', function() {
                if(!scope.status){
                    scope.iconStatus = "Invalid";
                }
                else{
                    scope.iconStatus = "Valid";
                }
            });
        },
        template: '<div class="icon{{iconStatus}}"></div>'
    };
});