angular.module("revolutionApp").directive('clanheader', ['clanService', '$routeParams', '$q', 'fileService', function (clanService, $routeParams, $q, fileService) {
        return {
            scope: {},
            restrict: 'E',
            replace: true,
            templateUrl: '/templates/directives/clanheader.html',
            link : function ($scope, elem, attrs) {

                getClanInfo();
                isOwner();

                $scope.tab = attrs.tab;

                $scope.editNameInfo = {
                    isSubmitted: false,
                    isUnique: true,
                    isNameValid : true,
                    disabled: false,
                    name: null
                }
                
                $scope.editAvatarInfo = {
                    isSubmitted: false,
                    imageStatus: null
                }
                
                $scope.editHeaderInfo = {
                    isSubmitted: false,
                    imageStatus: null
                }

                $scope.imageStatus = fileService.imageStatus;

                $scope.openAvatarModal = function () {
                    jQuery('#editAvatarModal').appendTo("body").modal('show');
                }
                
                $scope.openHeaderModal = function () {
                    jQuery('#editHeaderModal').appendTo("body").modal('show');
                }
                
                $scope.selectEmblem = function () {
                    jQuery('#emblemFile').click();
                }
                
                $scope.selectHeader = function () {
                    jQuery('#headerFile').click();
                }
                
                $scope.openNameModal = function () {
                    jQuery('#editNameModal').appendTo("body").modal('show');
                }

                $scope.onEmblemChange = function (event) {
                    $scope.$apply(function() {
                        $scope.editAvatarInfo.isSubmitted = true;
                    });
                    clanService.uploadEmblem($routeParams.id, event.target.files[0]).then(function (data) {
                        if (data.status === fileService.imageStatus.Success) {
                            $scope.editAvatarInfo.isSubmitted = false;
                            $scope.editAvatarInfo.imageStatus = null;
                            $scope.clan.EmblemUrl = data.url;
                            jQuery('#editAvatarModal').modal('hide');
                        } else {
                            $scope.editAvatarInfo.imageStatus = data.status;
                        }
                    });
                }
                
                $scope.onHeaderChange = function (event) {
                    $scope.$apply(function() {
                        $scope.editHeaderInfo.isSubmitted = true;
                    });
                    clanService.uploadHeader($routeParams.id, event.target.files[0]).then(function (data) {
                        if (data.status === fileService.imageStatus.Success) {
                            $scope.editHeaderInfo.isSubmitted = false;
                            $scope.editHeaderInfo.imageStatus = null;
                            $scope.clan.HeaderUrl = data.url;
                            jQuery('#editHeaderModal').modal('hide');
                        } else {
                            $scope.editHeaderInfo.imageStatus = data.status;
                        }
                    })
                }

                $scope.updateName = function () {
                    $scope.editNameInfo.submitted = true;
                    $scope.editNameInfo.disabled = true;
                    clanService.editName($routeParams.id, $scope.editNameInfo.name).then(function (data) {
                        $scope.editNameInfo.disabled = false;
                        if (data.isNameValid && data.isUnique) {
                            $scope.editNameInfo.isUnique = true;
                            $scope.editNameInfo.isNameValid = true;
                            $scope.editNameInfo.submitted = false;
                            $scope.editNameInfo.name = null;
                            getClanInfo().then(function () {
                                jQuery('#editNameModal').modal('hide');
                            });
                        } else {
                            $scope.editNameInfo.isUnique = data.isUnique;
                            $scope.editNameInfo.isNameValid = data.isNameValid;
                        }
                    });
                }

                function getClanInfo() {
                    var def = $q.defer();
                    clanService.getById($routeParams.id).then(function (clan) {
                        $scope.clan = clan;

                        if(!$scope.clan){
                            $scope.clan = {
                                ClanId : $routeParams.id
                            };
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
            }
        };
    }]);