angular.module("revolutionApp").service("adminItemRotationService", ['$http', '$q',function ($http, $q) {

    this.getItems = getItems;
    this.deleteItem = deleteItem;
    this.addItem = addItem;

    function getItems(year, month) {
        var def = $q.defer();

        $http.get('/api/admin/rotation', {params: {year : year, month : month}}).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function deleteItem(id) {
        var def = $q.defer();

        $http.delete('/api/admin/rotation/' + id).then(function success() {
            def.resolve();
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function addItem(itemId, year, month) {
        var def = $q.defer();

        $http.post('/api/admin/rotation', { itemId : itemId, year : year, month : month}).then(function success() {
            def.resolve();
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }
}]);