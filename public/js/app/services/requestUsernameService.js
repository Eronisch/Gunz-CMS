angular.module("revolutionApp").service("requestUsernameService", ['$http', '$q', function ($http, $q) {

    function requestUsername(email, captcha) {
        var def = $q.defer();

        $http.get('/api/request-username', {params: {email: email, captcha: captcha}}).then(function (result) {
            def.resolve(result.data.status);
        }).catch(function (err) {
            console.log(err);
            def.reject(err);
        });

        return def.promise;
    }

    return {
        requestUsername: requestUsername
    }

}]);