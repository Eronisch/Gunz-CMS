angular.module("revolutionApp").directive('pagination', [function () {
    var counterId = 0;
    return {
        scope: {
            amount: '=',
            limit: '=',
            pagenumber: '=',
            onpaginate: '=',
            control: '='
        },
        replace: true,
        templateUrl: '/templates/directives/pagination.html',
        link: function (scope, elem, attrs) {
            scope.id = "pagination-" + counterId;

            scope.$watch('amount', function (amount) {
                setPagination(scope.id, amount, scope.pagenumber, scope.limit, scope.onpaginate);
            });

            scope.control = {
                reset: function () {
                    scope.pagenumber = 1;
                }
            }

            counterId++;
        }
    };

    function setPagination(id, amount, page, limit, navigateCallback) {
        jQuery(document).find('#' + id).pagination({
            items: amount,
            itemsOnPage: limit,
            currentPage: page,
            paginationClass: 'pagination',
            nextClass: 'next',
            prevClass: 'prev',
            lastClass: 'last',
            firstClass: 'first',
            pageClass: 'page',
            activeClass: 'active',
            disabledClass: 'disabled',
            prevText: '&#171;',
            nextText: '&#187;',
            onPageClick: function (pageNumber, event) {
                navigateCallback(pageNumber);
                event.preventDefault();
            }
        });
    }
}]);