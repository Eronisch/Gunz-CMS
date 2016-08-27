angular.module("revolutionApp").factory("serverStatusService", ['$http', '$q', function ($http, $q) {

    var postService = {};

    postService.getServerStatus = function () {
        var def = $q.defer();

        $http.get('/api/getServerStatus').then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log('An error occured retrieving while retrieving the server status');
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    };

    return postService;
}]);