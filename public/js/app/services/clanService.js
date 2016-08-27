angular.module("revolutionApp").service("clanService", ["$http", "$q", "upload", "fileService", function ($http, $q, upload, fileService) {
        
        function getClanRanking(page, limit) {
            var def = $q.defer();
            
            $http.get('/api/ranking/clan', { params: { page : page, limit : limit } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }

    function getSearchClanRanking(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/ranking/clan/' + search, { params: { page : page, limit : limit } }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }
        
        function uploadEmblem(clanId, file) {
            
            var def = $q.defer();
            
            if (!file) { def.resolve({ status : fileService.imageStatus.NoImage }); return def.promise; }
            
            if (!fileService.isValidSize(2.5, file))  { def.resolve({ status : fileService.imageStatus.TooLarge }); return def.promise; }
            
            if (!fileService.isImage(file.name)) { def.resolve({ status : fileService.imageStatus.InvalidImage }); return def.promise; }
            
            upload({
                url: '/api/clan/' + clanId + '/emblem',
                method: 'PUT',
                data: {
                    aFile: file
                }
            }).then(function (response) {
                def.resolve({
                    status: fileService.imageStatus.Success,
                    url: response.data.url + "?timestamp=" + new Date().getTime()
                });
            }).catch(function (err) {
                console.log(err);
                def.reject(fileService.imageStatus.Error);
            });
            
            return def.promise;
        }
        
        function uploadHeader(clanId, file) {
            
            var def = $q.defer();
            
            if (!file) { def.resolve({ status : fileService.imageStatus.NoImage }); return def.promise; }
            
            if (!fileService.isValidSize(5, file)) { def.resolve({ status : fileService.imageStatus.TooLarge }); return def.promise; }
            
            if (!fileService.isImage(file.name)) { def.resolve({ status : fileService.imageStatus.InvalidImage }); return def.promise; }
            
            upload({
                url: '/api/clan/ ' + clanId + '/header',
                method: 'PUT',
                data: {
                    aFile: file
                }
            }).then(function (response) {
                def.resolve({
                    status: fileService.imageStatus.Success,
                    url: response.data.url + "?timestamp=" + new Date().getTime()
                });
            }).catch(function (err) {
                console.log(err);
                def.reject(fileService.imageStatus.Error);
            });
            
            return def.promise;
        }
        
        function getAmountMembers(clanId) {
            var def = $q.defer();
            $http.get('/api/clan/' + clanId + '/members/amount').then(function success(response) {
                def.resolve(response.data.amount);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function getAmountMatches(clanId) {
            var def = $q.defer();
            $http.get('/api/clan/' + clanId + '/matches/amount').then(function success(response) {
                def.resolve(response.data.amount);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function getById(clanId) {
            var def = $q.defer();
            
            $http.get('/api/clan/' + clanId).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getMatches(clanId, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/clan/' + clanId + '/matches', { params : { limit : limit, page : page } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getClansFromAccount(accountId, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/account/' + accountId + '/clans', { params : { limit : limit, page : page } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getAdministrators(clanId, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/clan/' + clanId + '/administrators', { params : { limit : limit, page : page } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getComments(clanId, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/clan/' + clanId + '/comments', { params : { limit : limit, page : page } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getMembers(clanId, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/clan/' + clanId + '/members', { params : { limit : limit, page : page } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function addComment(clanId, comment) {
            var def = $q.defer();
            
            $http.post('/api/clan/' + clanId + '/comments', 
            { comment : comment }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function editName(clanId, name) {
            var def = $q.defer();
            
            if (name.length > 24) {def.resolve({ isNameValid: false, isUnique : true }); return def.promise;}
            
            $http.put('/api/clan/' + clanId + '/name', 
            { name : name }).then(function success(response) {
                def.resolve({
                    isUnique : response.data.isUnique,
                    isNameValid : true
                });
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }

        function resetScore(clanId) {
            var def = $q.defer();
            $http.put('/api/clan/' + clanId + '/reset').then(function success() {
                def.resolve();
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function updateIntroduction(clanId, introduction) {
            var def = $q.defer();
            $http.put('/api/clan/' + clanId + '/introduction', { introduction : introduction }).then(function success() {
                def.resolve();
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function isOwner(clanId) {
            var def = $q.defer();
            
            $http.get('/api/clan/' + clanId + '/isOwner').then(function success(response) {
                def.resolve(response.data.isOwner);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function promoteMember(clanId, characterId) {
            var def = $q.defer();
            $http.put('/api/clan/' + clanId + '/promote', { characterId : characterId }).then(function success() {
                def.resolve();
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function demoteMember(clanId, characterId) {
            var def = $q.defer();
            $http.put('/api/clan/' + clanId + '/demote', { characterId : characterId}).then(function success() {
                def.resolve();
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function deleteMembers(clanId, characterIds) {
            var def = $q.defer();
            $http.delete('/api/clan/' + clanId + '/members', { params : { characterIds: characterIds } }).then(function success() {
                def.resolve();
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        return {
            getClanRanking : getClanRanking,
            uploadEmblem : uploadEmblem,
            uploadHeader  : uploadHeader,
            getById : getById,
            getAmountMembers : getAmountMembers,
            getMatches : getMatches,
            getAdministrators : getAdministrators,
            getComments  : getComments,
            addComment  : addComment,
            resetScore  : resetScore,
            updateIntroduction  : updateIntroduction,
            isOwner : isOwner,
            editName : editName,
            getMembers : getMembers,
            promoteMember : promoteMember,
            demoteMember : demoteMember,
            deleteMembers : deleteMembers,
            getClansFromAccount  : getClansFromAccount,
            getAmountMatches  : getAmountMatches,
            getSearchClanRanking : getSearchClanRanking
        }
    }]);