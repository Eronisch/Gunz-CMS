angular.module("revolutionApp").controller('adminCharacterController', ['$scope', 'adminCharacterService', '$timeout', function ($scope, adminCharacterService, $timeout) {

    $scope.players = [];
    $scope.search = null;
    $scope.searchText = null;
    $scope.amountCharacters = 0;
    $scope.viewingMinimum = 0;
    $scope.viewingMaximum = 0;

    $scope.models = {
        editCharacter: {}
    };

    $scope.loaders = {
        isSavingCharacter: false
    };

    var page = 1;
    var searchTimeOut = null;
    var AMOUNT_LIMIT = 15;

    getBreadCrumbs();
    getCharacters(1);

    $scope.search = function () {
        if (searchTimeOut) {
            $timeout.cancel(searchTimeOut);
        }

        searchTimeOut = $timeout(function () {
            searchCharacters(page, $scope.searchText);
        }, 250);
    };

    $scope.showEditCharacterModal = function (character) {
        $scope.models.editCharacter = {
            cid: character.Cid,
            name: character.Name,
            killCount: character.KillCount,
            deathCount: character.DeathCount,
            redColor: character.nRedColor,
            greenColor: character.nGreenColor,
            blueColor: character.nBlueColor
        };
        jQuery('#editCharacterModal').appendTo("body").modal('show');
    };

    $scope.editCharacterRecord = function () {
        $scope.loaders.isSavingCharacter = true;
        adminCharacterService.update($scope.models.editCharacter.cid, $scope.models.editCharacter.name,
            $scope.models.editCharacter.killCount, $scope.models.editCharacter.deathCount, $scope.models.editCharacter.redColor,
            $scope.models.editCharacter.greenColor, $scope.models.editCharacter.blueColor).then(function () {
            getCharacters().then(function () {
                $scope.models.editCharacter = {};
                $scope.loaders.isSavingCharacter = false;
                jQuery('#editCharacterModal').modal('hide');
            })
        })
    };

    function getBreadCrumbs() {
        $scope.breadcrumbs = {
            title: "Character administration",
            links: [
                {
                    title: "Admin",
                    link: '/admin'
                },
                {
                    title: 'Character'
                }
            ]
        }
    }

    function getCharacters(page, search) {
        return adminCharacterService.getAll(page, AMOUNT_LIMIT, search).then(function (result) {
            $scope.players = result.characters;
            setPagination(result.amount, page, AMOUNT_LIMIT);
            setViewingInfo(result.amount, page, AMOUNT_LIMIT);
        });
    }

    function navigate(pageNumber, event) {
        getCharacters(pageNumber, $scope.searchText);
        event.preventDefault();
    }

    function setPagination(amountItems, page, limit) {
        jQuery(document).find('.pagination').pagination({
            items: amountItems,
            itemsOnPage: limit,
            currentPage: page,
            paginationClass: 'pagination',
            nextClass: 'next',
            prevClass: 'prev',
            lastClass: 'last',
            firstClass: 'first',
            pageClass: 'page',
            activeClass: 'active',
            disabledClass: 'disabled',
            prevText: '&#171;',
            nextText: '&#187;',
            onPageClick: navigate
        });
    }

    function setViewingInfo(amountCharacters, pageNumber, limit) {
        $scope.amountCharacters = amountCharacters;
        $scope.viewingMinimum = pageNumber > 1 ? pageNumber * limit - (limit - 1) : 1;
        $scope.viewingMaximum = pageNumber * limit;
    }

}]);