angular.module("revolutionApp").service("resetPasswordService", ['$http', '$q', function ($http, $q) {

    function sendResetPasswordLink(email, captcha) {
        var def = $q.defer();

        $http.get('/api/reset-password', {params: {email: email, captcha: captcha}}).then(function (result) {
            def.resolve(result.data.status);
        }).catch(function (err) {
            console.log(err);
            def.reject(err);
        });

        return def.promise;
    }

    function resetPassword(code, password, captcha) {
        var def = $q.defer();

        $http.put('/api/reset-password', {code: code, password: password, captcha : captcha}).then(function (result) {
            def.resolve(result.data.status);
        }).catch(function (err) {
            console.log(err);
            def.reject(err);
        });

        return def.promise;
    }

    return {
        sendResetPasswordLink: sendResetPasswordLink,
        resetPassword : resetPassword
    }

}]);