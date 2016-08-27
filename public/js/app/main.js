var app = angular.module("revolutionApp", ["ngRoute", "lr.upload", "ui.tinymce", 'vcRecaptcha', 'ngAnimate', 'timer']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    var requireLogin = function (accountService, $q, $location) {
        var deferred = $q.defer();

        accountService.isLoggedIn().then(function (isLoggedIn) {
            if (isLoggedIn) {
                deferred.resolve();
            }
            else {
                $location.path("/login");
                deferred.reject();
            }
        }).catch(function (err) {
            console.log(err);
            $location.path("/login");
            deferred.reject(err);
        });

        return deferred.promise;
    };

    requireLogin.$inject = ['accountService', '$q', '$location'];

    $locationProvider.html5Mode(true);

    $routeProvider.when('/', {
        title: 'Home | GunzFactor',
        templateUrl: '/templates/home.html',
        controller: 'homeController'
    }).when('/register', {
        title: 'Register | GunzFactor',
        templateUrl: '/templates/register.html',
        controller: 'registerController'
    }).when('/download', {
        title: 'Download | GunzFactor',
        templateUrl: '/templates/download.html',
        controller: 'downloadController'
    }).when('/login', {
        title: 'Login | GunzFactor',
        templateUrl: '/templates/login.html',
        controller: 'loginController'
    }).when('/account', {
        title: 'Edit account | GunzFactor',
        templateUrl: '/templates/account.html',
        controller: 'accountController',
        resolve: {
            login: requireLogin
        }
    }).when('/account/characters', {
        title: 'My characters | GunzFactor',
        templateUrl: '/templates/characters.html',
        controller: 'charactersController',
        resolve: {
            login: requireLogin
        }
    }).when('/account/clans', {
        title: 'My clans | GunzFactor',
        templateUrl: '/templates/myClans.html',
        controller: 'accountClansController',
        resolve: {
            login: requireLogin
        }
    }).when('/clan/view/:id', {
        title: 'Clan | GunzFactor',
        templateUrl: '/templates/clan.html',
        controller: 'clanController'
    }).when('/clan/view/:id/members', {
        title: 'Clan members | GunzFactor',
        templateUrl: '/templates/clanMembers.html',
        controller: 'clanMembersController'
    }).when('/clan/view/:id/matches', {
        title: 'Clan matches | GunzFactor',
        templateUrl: '/templates/clanMatches.html',
        controller: 'clanMatchesController'
    }).when('/character/view/:id', {
        title: 'Character | GunzFactor',
        templateUrl: '/templates/character.html',
        controller: 'characterController'
    }).when('/character/view/:id/friends', {
        title: 'Character friends | GunzFactor',
        templateUrl: '/templates/characterFriends.html',
        controller: 'characterFriendsController'
    }).when('/character/view/:id/matches', {
        title: 'Character matches | GunzFactor',
        templateUrl: '/templates/characterMatches.html'
    }).when('/individualranking', {
        title: 'Individual ranking | GunzFactor',
        templateUrl: '/templates/individualRanking.html',
        controller: 'individualRankingController'
    }).when('/clanranking', {
        title: 'Clan ranking | GunzFactor',
        templateUrl: '/templates/clanRanking.html',
        controller: 'clanRankingController'
    }).when('/launcher', {
        title: 'Launcher | GunzFactor',
        templateUrl: '/templates/launcher.html'
    }).when('/shop', {
        title: 'Donator Shop | GunzFactor',
        templateUrl: '/templates/shop.html',
        controller: 'shopController',
        reloadOnSearch: false
    }).when('/donate', {
        title: 'Donate | GunzFactor',
        templateUrl: '/templates/donate.html',
        controller: 'donateController'
    }).when('/donate/cancelled', {
        title: 'Donate Cancelled | GunzFactor',
        templateUrl: '/templates/donateCancelled.html',
        controller: 'donateCancelledController'
    }).when('/donate/error', {
        title: 'Donate Error | GunzFactor',
        templateUrl: '/templates/donateError.html',
        controller: 'donateErrorController'
    }).when('/donate/success', {
        title: 'Donate Success | GunzFactor',
        templateUrl: '/templates/donateSuccess.html',
        controller: 'donateSuccessController'
    }).when('/donate/alreadypayed', {
        title: 'Donate Already Payed | GunzFactor',
        templateUrl: '/templates/donateAlreadyPayed.html',
        controller: 'donateAlreadyPayedController'
    }).when('/donate/pending', {
        title: 'Donate Pending | GunzFactor',
        templateUrl: '/templates/donatePending.html',
        controller: 'donatePendingController'
    }).when('/admin', {
        title: 'Admin | GunzFactor',
        templateUrl: '/templates/admin/admin.html',
        controller: 'adminController'
    }).when('/admin/character', {
        title: 'Admin Character | GunzFactor',
        templateUrl: '/templates/admin/adminCharacter.html',
        controller: 'adminCharacterController'
    }).when('/admin/account', {
        title: 'Admin Account | GunzFactor',
        templateUrl: '/templates/admin/adminAccount.html',
        controller: 'adminAccountController'
    }).when('/admin/paysafecard', {
        title: 'Admin Paysafecard | GunzFactor',
        templateUrl: '/templates/admin/adminPaySafeCard.html',
        controller: 'adminPaySafeCardController'
    }).when('/admin/items', {
        title: 'Admin Items | GunzFactor',
        templateUrl: '/templates/admin/adminItems.html',
        controller: 'adminItemsController'
    }).when('/admin/clan', {
        title: 'Admin Clan | GunzFactor',
        templateUrl: '/templates/admin/adminClan.html',
        controller: 'adminClanController'
    }).when('/admin/paypal', {
        title: 'Admin PayPal | GunzFactor',
        templateUrl: '/templates/admin/adminPaypal.html',
        controller: 'adminPaypalController'
    }).when('/admin/itemOfTheDay', {
        title: 'Admin Item of the day | GunzFactor',
        templateUrl: '/templates/admin/adminItemOfTheDay.html',
        controller: 'adminItemOfTheDayController'
    }).when('/admin/shop', {
        title: 'Admin Shop | GunzFactor',
        templateUrl: '/templates/admin/adminShop.html',
        controller: 'adminShopController'
    }).when('/admin/rotation', {
        title: 'Admin Item Rotation | GunzFactor',
        templateUrl: '/templates/admin/adminRotation.html',
        controller: 'adminItemRotationController'
    }).when('/shop/:id/item', {
        title: 'Donator Shop Item | GunzFactor',
        templateUrl: '/templates/shopItem.html',
        controller: 'shopItemController'
    }).when('/request-username', {
        title: 'Request username | GunzFactor',
        templateUrl: '/templates/requestUsername.html',
        controller: 'requestUsernameController'
    }).when('/reset-password', {
            title: 'Reset password | GunzFactor',
            templateUrl: '/templates/resetPassword.html',
            controller: 'resetPasswordController'
        }).when('/reset-password/:code', {
            title: 'Reset password | GunzFactor',
            templateUrl: '/templates/resetPasswordStepTwo.html',
            controller: 'resetPasswordStepTwoController'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current) {
        if (current.$$route) {
            $rootScope.title = current.$$route.title;
        }
    });

    $rootScope.$on('$routeChangeStart', function(){
        jQuery('.modal').remove();
    });

    $rootScope.$on('$viewContentLoaded', function () {
        jQuery('#view').find('.fadeView').append('<footer class="container"><div class="copyright"><p>© &nbsp; GunzFactor 2015 - Coded by James.&nbsp;</p> </div></footer>');
    });
}]);

jQuery(document).on('click', 'a', function () {
    ga('send', 'pageview', jQuery(this).attr('href'));
});
