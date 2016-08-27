angular.module("revolutionApp").service("adminPaySafeCardService", ['$http', '$q', function ($http, $q) {

    function getAll(page, limit) {
        var def = $q.defer();

        $http.get('/api/admin/paysafecard', {params: {page: page, limit: limit}}).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function searchAll(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/admin/paysafecard', { params : { page : page, limit : limit, search : search } }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function acceptPayment(id) {
        var def = $q.defer();

        $http.put('/api/admin/paysafecard/' + id + '/payment').then(function success() {
            def.resolve();
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    return {
        getAll: getAll,
        searchAll : searchAll,
        acceptPayment : acceptPayment
    }
}]);