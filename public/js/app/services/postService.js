angular.module("revolutionApp").factory("postService", ['$http', '$q', function ($http, $q) {

    var postService = {};

    postService.getThreads = function (id) {
        var def = $q.defer();

        $http.get('/api/forum/' + id + '/threads').then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    };

    return postService;
}]);