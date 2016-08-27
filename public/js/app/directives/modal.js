angular.module("revolutionApp").directive('modal', function () {
    return {
        scope: {
        },
        transclude: true,
        restrict: 'E',
        replace : true,
        link : function(scope, elem, attrs){
            scope.title = attrs.title;
            scope.id = attrs.id;
        },
        templateUrl : '/templates/directives/modal.html'
    };
});