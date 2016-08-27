// assets.js
module.exports = function(assets) {

    assets.root = __dirname;
    assets.addJs('/public/js/jquery.js');
    assets.addJs('/public/js/date.js');
    //assets.addJs('/public/js/snow.js');
    assets.addJs('/public/js/bootstrap.min.js');
    assets.addJs('/public/js/jquery.elastic.source.js');
    assets.addJs('/public/js/layerslider.transitions.js');
    assets.addJs('/public/js/layerslider.kreaturamedia.jquery.js');
    assets.addJs('/public/js/owl/owl.carousel.min.js');
    assets.addJs('/public/js/pagination.js');
    assets.addJs('/public/js/angular-route.js');
    assets.addJs('/public/js/angular-animate.js');
    assets.addJs('/public/js/angular-upload.min.js');
    assets.addJs('/public/js/angular-timer-all.min.js');
    assets.addJs('/public/js/app/main.js');
    assets.addJsUrl('http://connect.facebook.net/en_US/all.js');

    // Services
    assets.addJs('/public/js/app/services/accountService.js');
    assets.addJs('/public/js/app/services/postService.js');
    assets.addJs('/public/js/app/services/serverStatusService.js');
    assets.addJs('/public/js/app/services/clanService.js');
    assets.addJs('/public/js/app/services/characterService.js');
    assets.addJs('/public/js/app/services/messageService.js');
    assets.addJs('/public/js/app/services/shopService.js');
    assets.addJs('/public/js/app/services/donatorService.js');
    assets.addJs('/public/js/app/services/fileService.js');
    assets.addJs('/public/js/app/services/admin/adminCharacterService.js');
    assets.addJs('/public/js/app/services/admin/adminAccountService.js');
    assets.addJs('/public/js/app/services/admin/adminPaySafeCardService.js');
    assets.addJs('/public/js/app/services/admin/adminItemService.js');
    assets.addJs('/public/js/app/services/admin/adminClanService.js');
    assets.addJs('/public/js/app/services/admin/adminPaypalService.js');
    assets.addJs('/public/js/app/services/admin/adminItemOfTheDayService.js');
    assets.addJs('/public/js/app/services/admin/adminShopService.js');
    assets.addJs('/public/js/app/services/admin/adminItemRotationService.js');
    assets.addJs('/public/js/app/services/paySafeCardService.js');
    assets.addJs('/public/js/app/services/requestUsernameService.js');
    assets.addJs('/public/js/app/services/resetPasswordService.js');

    // Directives
    assets.addJs('/public/js/app/directives/itemOfTheDay.js');
    assets.addJs('/public/js/app/directives/statistics.js');
    assets.addJs('/public/js/app/directives/download.js');
    assets.addJs('/public/js/app/directives/header.js');
    assets.addJs('/public/js/app/directives/clan.js');
    assets.addJs('/public/js/app/directives/tinymce.js');
    assets.addJs('/public/js/app/directives/breadcrumbs.js');
    assets.addJs('/public/js/app/directives/clanHeader.js');
    assets.addJs('/public/js/app/directives/playerRanking.js');
    assets.addJs('/public/js/app/directives/clanRanking.js');
    assets.addJs('/public/js/app/directives/characterHeader.js');
    assets.addJs('/public/js/app/directives/purchaseShopItem.js');
    assets.addJs('/public/js/app/directives/captcha.js');
    assets.addJs('/public/js/app/directives/fileUploadChange.js');
    assets.addJs('/public/js/app/directives/valid.js');
    assets.addJs('/public/js/app/directives/account.js');
    assets.addJs('/public/js/app/directives/modal.js');
    assets.addJs('/public/js/app/directives/compareTo.js');
    assets.addJs('/public/js/app/directives/pagination.js');

    // Controllers
    assets.addJs('/public/js/app/controllers/homeController.js');
    assets.addJs('/public/js/app/controllers/loginController.js');
    assets.addJs('/public/js/app/controllers/characterController.js');
    assets.addJs('/public/js/app/controllers/charactersController.js');
    assets.addJs('/public/js/app/controllers/characterFriendsController.js');
    assets.addJs('/public/js/app/controllers/clanMembersController.js');
    assets.addJs('/public/js/app/controllers/clanMatchesController.js');
    assets.addJs('/public/js/app/controllers/individualRankingController.js');
    assets.addJs('/public/js/app/controllers/accountClansController.js');
    assets.addJs('/public/js/app/controllers/accountController.js');
    assets.addJs('/public/js/app/controllers/registerController.js');
    assets.addJs('/public/js/app/controllers/clanController.js');
    assets.addJs('/public/js/app/controllers/clanRankingController.js');
    assets.addJs('/public/js/app/controllers/downloadController.js');
    assets.addJs('/public/js/app/controllers/shopController.js');
    assets.addJs('/public/js/app/controllers/shopItemController.js');
    assets.addJs('/public/js/app/controllers/donateController.js');
    assets.addJs('/public/js/app/controllers/donateCancelledController.js');
    assets.addJs('/public/js/app/controllers/donateErrorController.js');
    assets.addJs('/public/js/app/controllers/donateSuccessController.js');
    assets.addJs('/public/js/app/controllers/donatePendingController.js');
    assets.addJs('/public/js/app/controllers/donateAlreadyPayedController.js');
    assets.addJs('/public/js/app/controllers/requestUsernameController.js');
    assets.addJs('/public/js/app/controllers/resetPasswordController.js');
    assets.addJs('/public/js/app/controllers/resetPasswordStepTwoController.js');
    assets.addJs('/public/js/app/controllers/admin/adminController.js');
    assets.addJs('/public/js/app/controllers/admin/adminCharacterController.js');
    assets.addJs('/public/js/app/controllers/admin/adminAccountController.js');
    assets.addJs('/public/js/app/controllers/admin/adminPaySafeCardController.js');
    assets.addJs('/public/js/app/controllers/admin/adminItemsController.js');
    assets.addJs('/public/js/app/controllers/admin/adminClanController.js');
    assets.addJs('/public/js/app/controllers/admin/adminPaypalController.js');
    assets.addJs('/public/js/app/controllers/admin/adminItemOfTheDayController.js');
    assets.addJs('/public/js/app/controllers/admin/adminShopController.js');
    assets.addJs('/public/js/app/controllers/admin/adminItemRotationController.js');

    // Stylesheets
    assets.addCss('/public/css/style.css');
    assets.addCss('/public/css/layerslider.css');
    assets.addCss('/public/colorstyles/picker.css');
    assets.addCss('/public/colorstyles/background3.css');
    assets.addCss('/public/css/owl/owl.carousel.css');
    assets.addCss('/public/css/owl/owl.theme.css');
    assets.addCss('/public/css/owl/owl.transitions.css');
    assets.addCss('/public/css/custom.css');
};