angular.module("revolutionApp").service("adminAccountService", ['$http', '$q', function ($http, $q) {

    function getAll(page, limit) {
        var def = $q.defer();

        $http.get('/api/admin/account', {params: {page: page, limit: limit}}).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function searchAll(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/admin/account/search', { params : { page : page, limit : limit, search : search } }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function addCash(userId, cash) {
        var def = $q.defer();

        $http.put('/api/admin/account/'  + userId + '/cash', { cash : cash }).then(function success(response) {
            def.resolve(response.data.isSuccess);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function ban(userId, date) {
        var def = $q.defer();

        $http.put('/api/admin/account/'  + userId + '/ban', { date : date}).then(function success(response) {
            def.resolve(response.data.isSuccess);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    return {
        getAll: getAll,
        searchAll : searchAll,
        addCash : addCash,
        ban : ban
    }
}]);