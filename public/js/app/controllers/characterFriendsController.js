angular.module("revolutionApp").controller('characterFriendsController', ['$scope', 'characterService', '$routeParams', '$timeout', '$q', function ($scope, characterService, $routeParams, $timeout, $q) {
        
        var page = 1;

        var searchTimeOut = null;
        
        $scope.friends = [];

        $scope.amountFriends = 0;

        $scope.viewingMinimum = 1;
        
        $scope.viewingMaximum = 8;

        $scope.order = "alphabetical";

        $scope.deleteCharacterFriendId = null;

        $scope.isDeleting = false;

        $scope.isOwner = false;

        setIsOwner();

        getFriends(1, true);
        
        $scope.showDeleteModal = function (friend) {
            console.log(friend.Cid);
            $scope.deleteCharacterFriendId = friend.Cid;
            jQuery('#deleteFriendModal').appendTo("body").modal('show');
        }
        
        $scope.deleteFriend = function () {
            $scope.isDeleting = true;
            characterService.removeFriend($routeParams.id, $scope.deleteCharacterFriendId).then(function() {
                if ($scope.friends.length === 1 && page > 1) {
                    page -= 1;
                }
                getFriends(page, true).then(function () {
                    jQuery('#deleteFriendModal').modal('hide');
                    $scope.isDeleting = false;
                });
            });
        }
        
        $scope.search = function () {
            
            if (searchTimeOut) {
                $timeout.cancel(searchTimeOut);
            }

            searchTimeOut = $timeout(function () {
                
                if (!getSearchQuery()) {
                    page = 1;
                }

                getFriends(page, true);
            }, 750);
        }
        
        $scope.changeOrder = function() {
            getFriends(1, false);
        }

    function setIsOwner() {
        characterService.isOwner($routeParams.id).then(function (isOwner) {
            $scope.isOwner = isOwner;
        });
    }
        
        function getFriends(pageNumber, initPagination) {
            var LIMIT = 8;
            var def = $q.defer();
            characterService.searchFriends($routeParams.id, getSearchQuery(), getOrder(), pageNumber, LIMIT).then(function (characters) {
                $scope.friends = characters.Friends;
                if (initPagination) {
                    setPagination(characters.Amount);    
                }
                $scope.amountFriends = characters.Amount;
                $scope.viewingMinimum = pageNumber > 1 ? pageNumber * LIMIT - (LIMIT - 1) : 1;
                $scope.viewingMaximum = pageNumber * LIMIT;

                if ($scope.viewingMaximum > $scope.amountFriends) {
                    $scope.viewingMaximum = $scope.amountFriends;
                }

                def.resolve();
            });
            return def.promise;
        }
        
        function getSearchQuery() {
            return $scope.searchUsername != null ? $scope.searchUsername : "";
        }
        
        function getOrder() {
            return $scope.order;
        }

        function navigate(pageNumber, event) {
            getFriends(pageNumber, false);
            event.preventDefault();
        }

        function setPagination(amountFriends) {
            jQuery('#pagination').pagination({
                items: amountFriends,
                itemsOnPage: 8,
                paginationClass: 'pagination',
                nextClass: 'next',
                prevClass: 'prev',
                lastClass: 'last',
                firstClass: 'first',
                pageClass: 'page',
                activeClass: 'active',
                disabledClass: 'disabled',
                prevText : '&#171;',
                nextText : '&#187;',
                onPageClick : navigate
            });
        }

    }]);