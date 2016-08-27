angular.module("revolutionApp").service("adminPaypalService", ['$http', '$q', function ($http, $q) {

    function getAll(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/admin/paypal', {params: {page: page, limit: limit, search : search}}).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    return {
        getAll: getAll
    }
}]);