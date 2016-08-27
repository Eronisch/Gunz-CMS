angular.module("revolutionApp").factory("accountService", ['$http', '$q', 'fileService', 'upload', function ($http, $q, fileService, upload) {

    var accountService = {};

    accountService.loginTypes = {
        invalidDetails: 0,
        blocked: 1,
        success: 2
    };

    accountService.isUsernameUnique = function (username) {
        var def = $q.defer();

        $http.get('/api/isUsernameUnique', {
            params: {username: username}
        }).then(function success(response) {
            def.resolve(response.data.status);
        }, function error(data) {
            console.log('An error occured when checking if the username is unique, please try again later.');
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    };

    accountService.isEmailUnique = function (email) {
        var def = $q.defer();

        $http.get('/api/isEmailUnique', {
            params: {
                email: email
            }
        }).then(function success(response) {
            def.resolve(response.data.status);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    };

    accountService.addAccount = function (account, captcha) {
        var def = $q.defer();

        account.captcha = captcha;

        $http.post('/api/addAccount', account).then(function (result) {
            def.resolve(result.data.isCaptchaValid);
        }).catch(function (data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    };

    accountService.getAccount = function () {
        var def = $q.defer();

        $http.get('/api/getAccount').then(function (result) {
            def.resolve(result.data);
        }).catch(function (data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    };

    accountService.login = function (username, password) {
        var def = $q.defer();
        $http.put('/api/account/session', {userName: username, password: password}).then(function (result) {
            def.resolve(result.data.type)
        });
        return def.promise;
    };

    accountService.logOut = function () {
        var def = $q.defer();
        $http.put('/api/login/logout').then(function () {
            def.resolve();
        });
        return def.promise;
    };

    accountService.isLoggedIn = function () {
        var def = $q.defer();

        $http.get('/api/isLoggedIn').then(function (result) {
            def.resolve(result.data.isLoggedIn);
        }).catch(function (err) {
            console.log(err);
            def.reject(err);
        });

        return def.promise;
    };

    accountService.getLoggedInUsername = function () {
        var def = $q.defer();

        $http.get('/api/getLoggedInUsername').then(function (result) {
            def.resolve(result.data);
        }).catch(function (err) {
            console.log(err);
            def.reject(err);
        });

        return def.promise;
    };

    accountService.getLoggedInUserId = function () {
        var def = $q.defer();

        $http.get('/api/login/userId').then(function (result) {
            def.resolve(result.data.accountId);
        }).catch(function (err) {
            console.log(err);
            def.reject(err);
        });

        return def.promise;
    };

    accountService.updateAccount = function (accountId, email, password, repeatPassword, file) {
        var def = $q.defer();

        upload({
            url: '/api/account/' + accountId,
            method: 'PUT',
            data: {
                email: email,
                password: password != null ? password : "",
                repeatPassword: repeatPassword != null ? repeatPassword : "",
                file: file
            }
        }).then(function () {
            def.resolve();
        }).catch(function (err) {
            console.log(err);
            def.reject(err);
        });
        return def.promise;
    };

    accountService.validateAvatar = function (file) {
        if (!file) {
            return fileService.imageStatus.NoImage;
        }

        if (!fileService.isValidSize(2.5, file)) {
            return fileService.imageStatus.TooLarge;
        }

        if (!fileService.isImage(file.name)) {
            return fileService.imageStatus.InvalidImage;
        }

        return fileService.imageStatus.Success;
    }

    return accountService;

}]);