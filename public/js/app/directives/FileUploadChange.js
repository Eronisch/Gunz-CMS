app.directive('onFileUploadChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.onFileUploadChange);
            element.bind('change', onChangeHandler);
        }
    };
});