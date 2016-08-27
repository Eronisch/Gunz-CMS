angular.module("revolutionApp").controller('homeController', ['$scope', '$location', 'postService', 'messageService', 'donatorService', 'shopService', '$sce', '$timeout', function ($scope, $location, postService, messageService, donatorService, shopService, $sce, $timeout) {

    $scope.isFromRegisterPage = $location.search().status !== undefined;
    $scope.isRegisterSuccess = $location.search().status === "true";
    $scope.threads = [];
    $scope.gunzThreads = [];
    $scope.clanRanking = [];
    $scope.playerRanking = [];
    $scope.account = null;
    $scope.successMessage = messageService.getSuccessMessage();
    $scope.errorMessage = messageService.getErrorMessage();
    $scope.donate = {
        goal: 0,
        current: 0,
        progress: 0
    };
    $scope.donatorItems = [];
    $scope.itemOfTheDayControl = {};
    $scope.accountControl = {};

    $scope.renderHtml = function (html) {
        return $sce.trustAsHtml(html);
    };

    $scope.onItemOftheDayPurchase = function(){
        $scope.accountControl.refresh();
    };

    $scope.donatorItemLoaded = function () {
        console.log('loaded');
    };

    getLatestNews();
    getLatestGunzArticles();
   // getDonation();
    getFacebook();
    getItemsOfEachCategory();

    function getItemsOfEachCategory() {
        shopService.getItemsOfEachCategory().then(function (items) {
            $scope.donatorItems = items;
            $scope.$watch('donatorItems', function () {
                jQuery("#itemShopCarousel").owlCarousel({
                    items: 5,
                    autoPlay: true,
                    stopOnHover: true,
                    rewindNav: true
                });
                $scope.isShopLoaded = true;
            });
        });
    }

    function getLatestNews() {
        postService.getThreads(129).then(function (data) {
            $scope.threads = data;
            $scope.isNewsLoaded = true;

            $timeout(updateWhiteUsernameArticles, 0);
        });
    }

    function getLatestGunzArticles() {
        postService.getThreads(128).then(function (data) {
            $scope.gunzThreads = data;
            $scope.isGunzLoaded = true;

            $timeout(updateWhiteUsernameArticles, 0);
        });
    }

    function updateWhiteUsernameArticles(){
        jQuery('.threads .username font').each(function(){
            console.log(jQuery(this).css('color'));
            if(jQuery(this).css('color') === 'rgb(255, 255, 255)'){
                jQuery(this).css('color', '#999');
            }
        });
    }

    function getFacebook(){
        FB.init({
            appId      : '741734805869593',
            xfbml      : true,
            version    : 'v2.4'
        });

        (function(d, s, id){
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {return;}
            js = d.createElement(s); js.id = id;
            js.src = "//connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        FB.Event.subscribe('xfbml.render', function() {
            $scope.$apply(function(){
                $scope.isFacebookLoaded = true;
            })
        });
    }

    function getDonation() {
        donatorService.getCurrentDonationThisMonth().then(function (amount) {
            $scope.donate = {
                goal: donatorService.getGoal(),
                current: amount
            };
            $scope.donate.progress = 100 / $scope.donate.goal * $scope.donate.current;
        });
    }
}]);