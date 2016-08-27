angular.module("revolutionApp").service("adminItemService", ['$http', '$q', function ($http, $q) {

    function sendItem(username, itemId, quantity, days) {
        var def = $q.defer();

        $http.post('/api/admin/item', {username : username, itemId : itemId, quantity : quantity, days : days}).then(function success(response) {
            def.resolve(response.data.isSuccess);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    return {
        sendItem: sendItem
    }
}]);