angular.module("revolutionApp").service("paySafeCardService",['$q', '$http', function ($q, $http) {

    function purchase(paymentOptionId, code) {
        var def = $q.defer();

        $http.post('/api/donate/paysafecard', {paymentOptionId : paymentOptionId, code : code}).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    return {
        purchase : purchase
    }
}]);