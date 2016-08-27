angular.module("revolutionApp").service("shopService", ['$http', '$q', function ($http, $q) {

        var PURCHASE_TYPES = {
            thirtyDays : 0,
            sixtyDays : 1,
            unlimited : 2
        };

        function getCategories() {
            var def = $q.defer();
            $http.get('/api/shop/categories').then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function getItems(categoryId, sex, page, limit) {
            var def = $q.defer();
            $http.get('/api/shop/categories/' + categoryId + '/items', {params : { sex : sex, page : page, limit : limit}}).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function getItem(id) {
            var def = $q.defer();
            $http.get('/api/shop/item/' + id).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function getCategory(id) {
            var def = $q.defer();
            $http.get('/api/shop/categories/' + id).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function purchaseItem(id, purchaseType) {
            var def = $q.defer();
            $http.post('/api/shop/item/' + id + '/purchase', {purchaseType : purchaseType}).then(function success(response) {
                def.resolve(response.data.isSuccess);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }

    function getItemsOfEachCategory() {
        var def = $q.defer();
        $http.get('/api/shop/categories/each/item').then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });
        return def.promise;
    }

    function getItemOfTheDay() {
        var def = $q.defer();
        $http.get('/api/shop/itemOfTheDay').then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });
        return def.promise;
    }

    function getStock() {
        var def = $q.defer();
        $http.get('/api/shop/itemOfTheDay/stock').then(function success(response) {
            def.resolve(response.data.stock);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });
        return def.promise;
    }

    function purchaseItemOfTheDay(purchaseType) {
        var def = $q.defer();
        $http.post('/api/shop/itemOfTheDay/purchase', {purchaseType : purchaseType}).then(function success(response) {
            def.resolve(response.data.status);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });
        return def.promise;
    }

        return {
            getCategories : getCategories,
            getItems  : getItems,
            getItem : getItem,
            getCategory : getCategory,
            purchaseItem : purchaseItem,
            getItemsOfEachCategory : getItemsOfEachCategory,
            getItemOfTheDay : getItemOfTheDay,
            purchaseItemOfTheDay : purchaseItemOfTheDay,
            getStock : getStock,
            PURCHASE_TYPES : PURCHASE_TYPES
        }
}]);