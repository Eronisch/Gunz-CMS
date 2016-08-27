angular.module("revolutionApp").controller('clanMembersController', ['$scope', 'clanService', '$q', '$routeParams', function ($scope, clanService, $q, $routeParams) {
        
        $scope.members = [];

        $scope.page = 1;

        $scope.isOwner = false;
        
        $scope.promoteMemberInfo = {
            isSubmitted: false,
            username  : null,
            id : null
        };
        
        $scope.demoteMemberInfo = {
            isSubmitted: false,
            username  : null,
            id : null
        };
        
        $scope.deleteMembersInfo = {
            selected : [],
            isSubmitted : false
        };
        
        loadMembers(1, 10);
        isOwner();
        
        $scope.showDeleteModal = function () {
            jQuery('#deleteMembersModal').appendTo("body").modal('show');
        };
        
        $scope.updateCheckStatus = function($index, username) {
            if ($scope.isUsernameSelected(username)) {
                removeMemberFromDeleteList(username);
                $scope.members[$index].isSelected = false;
            } else {
                addMemberToDeleteList($index);
                $scope.members[$index].isSelected = true;
            }
        };
        
        $scope.isUsernameSelected = function (username) {
            for (var i in $scope.deleteMembersInfo.selected) {
                if ($scope.deleteMembersInfo.selected[i].Character.Name === username) {
                    return true;
                }
            }
            return false;
        };
        
        $scope.deleteMembers = function () {
            $scope.deleteMembersInfo.isSubmitted = true;
            clanService.deleteMembers($routeParams.id, getSelectedMemberIds()).then(function() {
                loadMembers().then(function() {
                    $scope.deleteMembersInfo.selected = [];
                    $scope.deleteMembersInfo.isSubmitted = false;
                    jQuery('#deleteMembersModal').modal('hide');
                });
            });
        };
        
        $scope.openPromoteModal = function (id, username) {
            $scope.promoteMemberInfo.id = id;
            $scope.promoteMemberInfo.username = username;
            jQuery('#promoteMemberModal').appendTo("body").modal('show');
        };
        
        $scope.openDemoteModal = function (id, username) {
            $scope.demoteMemberInfo.id = id;
            $scope.demoteMemberInfo.username = username;
            jQuery('#demoteMemberModal').appendTo("body").modal('show');
        };
        
        $scope.promoteMember = function () {
            $scope.promoteMemberInfo.isSubmitted = true;
            clanService.promoteMember($routeParams.id, $scope.promoteMemberInfo.id).then(function () {
                loadMembers().then(function () {
                    $scope.promoteMemberInfo.id = null;
                    $scope.promoteMemberInfo.name = null;
                    $scope.promoteMemberInfo.isSubmitted = false;
                    jQuery('#promoteMemberModal').modal('hide');
                });
            });
        };
        
        $scope.demoteMember = function () {
            $scope.demoteMemberInfo.isSubmitted = true;
            clanService.demoteMember($routeParams.id, $scope.demoteMemberInfo.id).then(function () {
                loadMembers().then(function () {
                    $scope.demoteMemberInfo.id = null;
                    $scope.demoteMemberInfo.name = null;
                    $scope.demoteMemberInfo.isSubmitted = false;
                    jQuery('#demoteMemberModal').modal('hide');
                });
            });
        };
        
        function getSelectedMemberIds() {
            var ids = [];
            for (var i in $scope.deleteMembersInfo.selected) {
                ids.push($scope.deleteMembersInfo.selected[i].Character.Cid);
            }
            return ids;
        }
        
        function removeMemberFromDeleteList(username) {
            for (var i in $scope.deleteMembersInfo.selected) {
                if ($scope.deleteMembersInfo.selected[i].Character.Name === username) {
                    $scope.deleteMembersInfo.selected.splice(i, 1);
                    break;
                }
            }
        }
        
        function addMemberToDeleteList($index) {
            $scope.deleteMembersInfo.selected.push($scope.members[$index]);
        }
        
        function loadMembers(page, limit) {
            var def = $q.defer();
            
            clanService.getMembers($routeParams.id, page, limit).then(function (members) {
                $scope.members = members;
                def.resolve();
            });
            
            return def.promise;
        }

        function isOwner() {
            clanService.isOwner($routeParams.id).then(function (isOwner) {
                $scope.isOwner = isOwner;
            });
        }
    }]);