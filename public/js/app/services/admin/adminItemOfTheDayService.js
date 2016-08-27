angular.module("revolutionApp").service("adminItemOfTheDayService", ['$http', '$q', 'upload', function ($http, $q, upload) {

    function getAll(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/admin/itemOfTheDay', {
            params: {
                page: page,
                limit: limit,
                search: search
            }
        }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function addItem(item) {
        var def = $q.defer();

        upload({
            url: '/api/admin/itemOfTheDay',
            method: 'POST',
            data: item
        }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function editItem(id, item) {
        var def = $q.defer();

        upload({
            url: '/api/admin/itemOfTheDay/' + id,
            method: 'PUT',
            data: item
        }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function deleteItem(id) {
        var def = $q.defer();

        upload({
            url: '/api/admin/itemOfTheDay/' + id,
            method: 'DELETE'
        }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    return {
        getAll: getAll,
        addItem: addItem,
        editItem : editItem,
        deleteItem : deleteItem
    }
}]);