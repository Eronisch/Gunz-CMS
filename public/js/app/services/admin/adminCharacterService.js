angular.module("revolutionApp").service("adminCharacterService", ['$http', '$q', function ($http, $q) {


    function getAll(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/admin/character/', { params : { page : page, limit : limit, search : search } }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function update(cid, name, killCount, deathCount, redColor, greenColor, blueColor) {
        var def = $q.defer();

        $http.put('/api/admin/character/' + cid, { name : name, killCount : killCount, deathCount : deathCount, redColor : redColor, greenColor : greenColor, blueColor : blueColor}).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    return {
        getAll: getAll,
        update : update
    }
}]);