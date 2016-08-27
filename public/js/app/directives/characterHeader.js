angular.module("revolutionApp").directive('characterheader', ['characterService', '$routeParams', 'accountService', 'fileService', '$q', function (characterService, $routeParams, accountService, fileService, $q) {
        
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/characterHeader.html',
            link : function ($scope, elem, attrs) {
                
                $scope.tab = attrs.tab;

                $scope.editAvatarInfo = {
                    isSubmitted: false,
                    imageStatus: null
                }
                $scope.editHeaderInfo = {
                    isSubmitted: false,
                    imageStatus: null
                }
                $scope.isLoggedIn = false;
                $scope.imageStatus = fileService.imageStatus;
                $scope.character = null;
                $scope.isOwner = false;

                setIsLoggedIn();
                setIsOwner();
                loadCharacterInfo().then(getAmountFriends);
                
                $scope.openAvatarModal = function () {
                    jQuery('#editAvatarModal').appendTo("body").modal('show');
                }
                
                $scope.openHeaderModal = function () {
                    jQuery('#editHeaderModal').appendTo("body").modal('show');
                }
                
                $scope.onEmblemChange = function (event) {
                    $scope.$apply(function () {
                        $scope.editAvatarInfo.isSubmitted = true;
                    });
                    characterService.uploadEmblem($routeParams.id, event.target.files[0]).then(function (data) {
                        if (data.status === fileService.imageStatus.Success) {
                            $scope.editAvatarInfo.isSubmitted = false;
                            $scope.editAvatarInfo.imageStatus = null;
                            $scope.character.AvatarUrl = data.url;
                            jQuery('#editAvatarModal').modal('hide');
                        } else {
                            $scope.editAvatarInfo.imageStatus = data.status;
                        }
                    });
                }
                
                $scope.onHeaderChange = function (event) {
                    $scope.$apply(function () {
                        $scope.editHeaderInfo.isSubmitted = true;
                    });
                    characterService.uploadHeader($routeParams.id, event.target.files[0]).then(function (data) {
                        if (data.status === fileService.imageStatus.Success) {
                            $scope.editHeaderInfo.isSubmitted = false;
                            $scope.editHeaderInfo.imageStatus = null;
                            $scope.character.HeaderUrl = data.url;
                            jQuery('#editHeaderModal').modal('hide');
                        } else {
                            $scope.editHeaderInfo.imageStatus = data.status;
                        }
                    });
                }
                
                $scope.selectEmblem = function () {
                    jQuery('#emblemFile').click();
                }
                
                $scope.selectHeader = function () {
                    jQuery('#headerFile').click();
                }
                
                function loadCharacterInfo() {
                    var def = $q.defer();
                    characterService.getById($routeParams.id).then(function (character) {
                        $scope.character = character;

                        if(!$scope.character){
                            $scope.character = {
                                Cid : $routeParams.id
                            }
                        }
                        def.resolve();
                    });
                    return def.promise;
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

                function getAmountFriends() {
                    characterService.getAmountFriends($routeParams.id).then(function (amount) {
                        $scope.amountFriends = amount;
                    });
                }
            }}
}]);