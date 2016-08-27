angular.module("revolutionApp").controller('characterController', ['$scope', 'characterService', '$routeParams', '$q', 'fileService', 'accountService', '$timeout', '$sce', function ($scope, characterService, $routeParams, $q, fileService, accountService, $timeout, $sce) {

    $scope.character = null;
    $scope.amountFriends = 0;
    $scope.skills = [];
    $scope.friends = [];
    $scope.matches = [];
    $scope.comments = [];
    $scope.clanwars = [];
    $scope.levels = [];
    $scope.skills = [];
    $scope.isSubmittingChangeSex = false;
    $scope.hasCommentsLeft = false;
    $scope.commentsPage = 1;
    $scope.isRetrievingComments = false;
    $scope.isSubmittingComment = false;
    $scope.about = {
        submitted: false,
        text: null
    };
    $scope.skill = {
        isSubmitted : false,
        text : null,
        isLoading : false,
        removeSkillName : null,
        removeSkillId : null,
        isRemovingSkill : false
    };
    $scope.addSkillForm = {};

    setIsLoggedIn();

    loadCharacterInfo().then(function (character) {
        if (character) {
            $scope.about.text = character.About;
            setIsOwner();
            watchAboutMe();
            getSkills();
            getFriends();
            getMatches(1);
            getComments(1);
            getClanWar();
            getLevelUpLog();
        }
    });


    $scope.openGenderModal = function () {
        jQuery('#genderModal').appendTo("body").modal('show');
    };

    $scope.openSkillModal = function () {
        jQuery('#skillModal').appendTo("body").modal('show');
    };

    $scope.changeSex = function () {
        $scope.isSubmittingChangeSex = true;

        characterService.changeSex($routeParams.id).then(function () {
            $scope.isSubmittingChangeSex = false;
            jQuery('#genderModal').modal('hide');
        });
    };

    $scope.openRemoveSkillModal = function(skill){
        $scope.skill.removeSkillName = skill.Skill;
        $scope.skill.removeSkillId = skill.Id;
        jQuery('#removeSkillModal').appendTo("body").modal('show');
    };

    $scope.removeSkill = function(){
        $scope.skill.isRemovingSkill = true;
        characterService.removeSkill($routeParams.id, $scope.skill.removeSkillId).then(function () {
            getSkills().then(function () {
                jQuery('#removeSkillModal').modal('hide');
                $scope.skill.isRemovingSkill = false;
            });
        });
    };

    $scope.loadMoreComments = function () {
        $scope.commentsPage += 1;
        $scope.isRetrievingComments = true;
        characterService.getComments($routeParams.id, $scope.commentsPage, 5).then(function (comments) {
            comments.forEach(function (comment) {
                $scope.comments.push(comment);
            });
            $scope.isRetrievingComments = false;
            $scope.hasCommentsLeft = comments.length === 5;
        });
    };

    $scope.addComment = function () {
        $scope.isSubmittingComment = true;
        characterService.addComment($routeParams.id, $scope.comment).then(function () {
            getComments(1).then(function () {
                $scope.isSubmittingComment = false;
                $scope.comment = null;
                jQuery('html,body').animate({
                    scrollTop: jQuery("#comments").offset().top
                });
            });
        });
    };

    $scope.addSkill = function(form){
        $scope.skill.isSubmitted = true;

        console.log(form.$valid);

        if(form.$valid) {
            $scope.skill.isLoading = true;
            characterService.addSkill($routeParams.id, $scope.skill.text).then(function () {
                getSkills().then(function () {
                    jQuery('#skillModal').modal('hide');
                    $scope.skill.isSubmitted = false;
                    $scope.skill.isLoading = false;
                    $scope.skill.text = null;
                });
            });
        }
    };

    $scope.renderHtml = function (html) {
        return $sce.trustAsHtml(html);
    };

    function loadCharacterInfo() {
        var def = $q.defer();

        characterService.getById($routeParams.id).then(function (character) {
            $scope.character = character;
            return def.resolve(character);
        });

        return def.promise;
    }

    function getSkills() {
        var def = $q.defer();

        characterService.getSkills($routeParams.id).then(function (skills) {
            $scope.skills = skills;
            def.resolve();
        });

        return def.promise;
    }

    function getFriends() {
        characterService.getFriends($routeParams.id).then(function (friends) {
            $scope.friends = friends;
        });
    }

    function getMatches(page) {
        characterService.getMatches($routeParams.id, page, 5).then(function (matches) {
            $scope.matches = matches;
        });
    }

    function getComments(page) {
        var def = $q.defer();

        $scope.commentsPage = page;

        characterService.getComments($routeParams.id, page, 5).then(function (comments) {

            $scope.comments = comments;

            $scope.hasCommentsLeft = comments.length === 5;

            def.resolve();
        });
        return def.promise;
    }

    function getClanWar(page) {
        characterService.getClanwar($routeParams.id, page, 5).then(function (clanwars) {
            $scope.clanwars = clanwars;
        });
    }

    function getLevelUpLog() {
        characterService.getLevelUpLog($routeParams.id, 1, 5).then(function (data) {
            $scope.levels = data;
        });
    }

    function setIsOwner() {
        characterService.isOwner($routeParams.id).then(function (isOwner) {
            $scope.isOwner = isOwner;
        });
    }

    function setIsLoggedIn() {
        accountService.isLoggedIn().then(function (isLoggedIn) {
            $scope.isLoggedIn = isLoggedIn;
        });
    }

    function watchAboutMe() {

        var updateWatchMeTimeout = null;
        var previousText = $scope.about.text;
        var isFirstChange = true;

        $scope.$watch('about.text', function () {

            if (previousText !== String($scope.about.text).valueOf()) {

                if (isFirstChange) {
                    isFirstChange = false;
                    return;
                }

                if (updateWatchMeTimeout) {
                    $timeout.cancel(updateWatchMeTimeout);
                }

                updateWatchMeTimeout = $timeout(function () {
                    characterService.updateAbout($routeParams.id, $scope.about.text).then(function () {
                        jQuery('#aboutAlert').fadeIn(1000);
                        $timeout(function () {
                            jQuery('#aboutAlert').fadeOut(1000);
                        }, 5000);
                    });
                }, 1500);

                previousText = $scope.about.text;
            }
        }, true);
    }
}]);