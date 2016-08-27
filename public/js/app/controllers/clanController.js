angular.module("revolutionApp").controller('clanController', [
    '$scope', '$routeParams', 'accountService', 'clanService', '$q', '$timeout', '$sce', 'accountService', '$rootScope', function ($scope, $routeParams, accountService, clanService, $q, $timeout, $sce, accountService, $rootScope) {

        $scope.administrators = [];
        $scope.comments = [];
        $scope.commentsPage = 1;
        $scope.isLoadingComments = true;
        $scope.isSending = false;
        $scope.hasCommentsLeft = true;
        $scope.addComment = {
            comment: null
        }

        $scope.resetScore = {
            isLoading: false
        };
        
        $scope.introduction = {
            submitted: false,
            text : null
        }
        
        $scope.imageStatus = clanService.imageStatus;
        
        $scope.isLoggedIn = false;
        
        $scope.tinymceOptions = {
            inline: false,
            plugins : 'advlist autolink link image lists charmap print preview',
            skin: 'lightgray',
            theme : 'modern'
        };
        
        isOwner();
        getClanInfo().then(function(clan) {
            if(clan){
                $scope.introduction.text = clan.Introduction;
                watchIntroduction();

                getMatches();
                getAdministrators();
                getComments();
                setLoggedIn();
            }
        });

        
        $scope.openClanResetModal = function () {
            jQuery('#resetClanModal').appendTo("body").modal('show');
        }
        
        $scope.loadMoreComments = function () {
            $scope.commentsPage += 1;
            $scope.isLoadingComments = true;
            clanService.getComments($routeParams.id, $scope.commentsPage, 5).then(function (data) {
                
                if (5 > data.length) {
                    $scope.hasCommentsLeft = false;
                }
                
                data.forEach(function (comment) {
                    $scope.comments.push(comment);
                });

                $scope.isLoadingComments = false;
            });
        }
        
        $scope.createComment = function () {
            $scope.isSending = true;
            clanService.addComment($routeParams.id, $scope.addComment.comment).then(function () {
                getComments().then(function () {
                    $scope.isSending = false;
                    $scope.addComment.comment = null;
                    jQuery('html,body').animate({
                        scrollTop: jQuery("#comments").offset().top
                    });
                });
            });
        }
        
        $scope.resetScore = function () {
            $scope.resetScore.isLoading = true;
            clanService.resetScore($routeParams.id).then(function () {
                getClanInfo().then(function () {
                    $scope.resetScore.isLoading = false;
                    jQuery('#resetClanModal').modal('hide');
                });
            });
        }
        
        $scope.renderHtml = function (html) {
            return $sce.trustAsHtml(html);
        };
        
        function watchIntroduction() {
            
            var updateIntroductionTimer = null;
            var previousText = $scope.introduction.text;
            var isFirstChange = true;
            
            $scope.$watch('introduction.text', function () {
                
                if (previousText !== new String($scope.introduction.text).valueOf()) {
                    
                    if (isFirstChange) {
                        isFirstChange = false;
                        return;
                    }
                    
                    if (updateIntroductionTimer) {
                        $timeout.cancel(updateIntroductionTimer);
                    }
                    
                    updateIntroductionTimer = $timeout(function () {
                        clanService.updateIntroduction($routeParams.id, $scope.introduction.text).then(function () {
                            jQuery('#introductionAlert').fadeIn(1000);
                            $timeout(function () { jQuery('#introductionAlert').fadeOut(1000); }, 5000);
                        });
                    }, 1500);
                    
                    previousText = $scope.introduction.text;
                }
            }, true);
        }
        
        function getClanInfo() {
            var def = $q.defer();
            clanService.getById($routeParams.id).then(function (clan) {
                $scope.clan = clan;
                
                def.resolve(clan);
            });
            return def.promise;
        }
        
        function getMatches() {
            clanService.getMatches($routeParams.id, 1, 5).then(function (data) {
                $scope.matches = data.matches;
            });
        }
        
        function getAdministrators() {
            clanService.getAdministrators($routeParams.id, 1, 5).then(function (data) {
                $scope.administrators = data;
            });
        }
        
        function getComments() {
            var def = $q.defer();
            
            clanService.getComments($routeParams.id, $scope.addComment.page, 5).then(function (data) {
                $scope.comments = data;
                
                if (5 > data.length) {
                    $scope.hasCommentsLeft = false;
                }
                def.resolve();
            });
            
            return def.promise;
        }
        
        function isOwner() {
            clanService.isOwner($routeParams.id).then(function (isOwner) {
                $scope.isOwner = isOwner;
            });
        }
        
        function setLoggedIn() {
            accountService.isLoggedIn().then(function (isLoggedIn) {
                $scope.isLoggedIn = isLoggedIn;
            });
        }
    }]);