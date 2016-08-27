angular.module("revolutionApp").service("donatorService", ['$http', '$q', function ($http, $q) {

    function getGoal(){
        return 50;
    }

    function getCurrentDonationThisMonth(){
        var def = $q.defer();
        $http.get('/api/donate/currentmonth').then(function success(response) {
            def.resolve(response.data.amount);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });
        return def.promise;
    }

    return {
        getGoal : getGoal,
        getCurrentDonationThisMonth : getCurrentDonationThisMonth
    }

}]);