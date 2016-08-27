angular.module("revolutionApp").service("adminShopService", ['$http', '$q', 'upload', function ($http, $q, upload) {

    function getCategories(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/admin/shop/category', {
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

    function deleteCategory(id) {
        var def = $q.defer();

        $http.delete('/api/admin/shop/category/' + id).then(function success() {
            def.resolve();
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function deleteItem(id) {
        var def = $q.defer();

        $http.delete('/api/admin/shop/item/' + id).then(function success() {
            def.resolve();
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function getItems(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/admin/shop/item', {
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

    function getSets(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/admin/shop/set', {
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
            url: '/api/admin/shop/item',
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

    function addCategory(name) {
        var def = $q.defer();

        $http({
            url: '/api/admin/shop/category',
            method: 'POST',
            data: {
                name: name
            }
        }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function updateCategory(id, name) {
        var def = $q.defer();

        $http({
            url: '/api/admin/shop/category/' + id,
            method: 'PUT',
            data: {
                name: name
            }
        }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function editItem(item) {
        var def = $q.defer();

        upload({
            url: '/api/admin/shop/item/' + item.id,
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

    function addSet(setId, itemIds) {
        var def = $q.defer();

        $http({
            url: '/api/admin/shop/set/',
            method: 'POST',
            data: {
                setId: setId,
                itemIds: itemIds
            }
        }).then(function success() {
            def.resolve();
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function updateSet(setId, itemIds) {
        var def = $q.defer();

        $http({
            url: '/api/admin/shop/set/' + setId,
            method: 'PUT',
            data: {
                itemIds: itemIds
            }
        }).then(function success() {
            def.resolve();
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function deleteSet(setId, itemIds) {
        var def = $q.defer();

        $http({
            url: '/api/admin/shop/set/' + setId,
            method: 'DELETE',
            data: {
                itemIds: itemIds
            }
        }).then(function success() {
            def.resolve();
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    return {
        getCategories: getCategories,
        getItems: getItems,
        addItem: addItem,
        editItem: editItem,
        addCategory: addCategory,
        updateCategory: updateCategory,
        deleteCategory: deleteCategory,
        deleteItem: deleteItem,
        addSet: addSet,
        getSets : getSets,
        updateSet : updateSet,
        deleteSet : deleteSet
    }
}]);