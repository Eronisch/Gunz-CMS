angular.module("revolutionApp").service("characterService", ['$http', '$q', 'fileService', 'upload', function ($http, $q, fileService, upload) {
        
        function getPlayerRanking(page, limit) {
            var def = $q.defer();
            
            $http.get('/api/ranking/individual', { params : { page : page, limit : limit } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }

    function getSearchPlayerRanking(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/ranking/individualSearch', { params : { page : page, limit : limit, search : search } }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }


    function getAll(page, limit) {
        var def = $q.defer();

        $http.get('/api/character/', { params : { page : page, limit : limit } }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function searchAll(page, limit, search) {
        var def = $q.defer();

        $http.get('/api/character/search', { params : { page : page, limit : limit, search : search } }).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }
        
        function getById(id) {
            var def = $q.defer();
            
            $http.get('/api/character/' + id).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getAmountFriends(id) {
            var def = $q.defer();
            
            $http.get('/api/character/' + id + '/amountFriends').then(function success(response) {
                def.resolve(response.data.amount);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getSkills(id) {
            var def = $q.defer();
            
            $http.get('/api/character/' + id + '/skills').then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function changeSex(id) {
            var def = $q.defer();
            
            $http.put('/api/character/' + id + '/sex').then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getFriends(id, search, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/character/' + id + '/friends', { params : { page: page, limit: limit, search: search } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function searchFriends(id, search, order, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/character/' + id + '/searchFriends', { params : { page: page, limit: limit, order : order, search: search } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getMatches(id, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/character/' + id + '/matches', { params : { page : page, limit : limit } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getComments(id, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/character/' + id + '/comments', { params : { page : page, limit : limit } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getClanwar(id, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/character/' + id + '/clanwar', { params : { page : page, limit : limit } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function addComment(id, comment) {
            var def = $q.defer();
            
            $http.post('/api/character/' + id + '/comments', { comment : comment }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function getLevelUpLog(id, page, limit) {
            var def = $q.defer();
            
            $http.get('/api/character/' + id + '/levels', { params : { page : page, limit : limit } }).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }
        
        function uploadEmblem(characterId, file) {
            
            var def = $q.defer();
            
            if (!file) { def.resolve({ status : fileService.imageStatus.NoImage }); return def.promise; }
            
            if (!fileService.isValidSize(2.5, file)) { def.resolve({ status : fileService.imageStatus.TooLarge }); return def.promise; }
            
            if (!fileService.isImage(file.name)) { def.resolve({ status : fileService.imageStatus.InvalidImage }); return def.promise; }
            
            upload({
                url: '/api/character/' + characterId + '/emblem',
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
        
        function uploadHeader(characterId, file) {
            
            var def = $q.defer();
            
            if (!file) { def.resolve({ status : fileService.imageStatus.NoImage }); return def.promise; }
            
            if (!fileService.isValidSize(5, file)) { def.resolve({ status : fileService.imageStatus.TooLarge }); return def.promise; }
            
            if (!fileService.isImage(file.name)) { def.resolve({ status : fileService.imageStatus.InvalidImage }); return def.promise; }
            
            upload({
                url: '/api/character/ ' + characterId + '/header',
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
        
        function isOwner(characterId) {
            var def = $q.defer();
            
            $http.get('/api/character/' + characterId + '/isOwner').then(function success(response) {
                def.resolve(response.data.isOwner);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        };
        
        function updateAbout(characterId, about) {
            var def = $q.defer();
            $http.put('/api/character/' + characterId + '/about', { about : about}).then(function success() {
                def.resolve();
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            return def.promise;
        }
        
        function removeFriend(characterId, friendCharacterId) {
            var def = $q.defer();
            
            $http.delete('/api/character/' + characterId + '/friend/' + friendCharacterId).then(function success(response) {
                def.resolve(response.data);
            }, function error(data) {
                console.log(data);
                def.reject(data);
            });
            
            return def.promise;
        }

    function addSkill(characterId, skill){
        var def = $q.defer();

        $http.post('/api/character/' + characterId + '/skill/', {skill : skill}).then(function () {
            def.resolve();
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }

    function removeSkill(characterId, skillId) {
        var def = $q.defer();

        $http.delete('/api/character/' + characterId + '/skill/' + skillId).then(function success(response) {
            def.resolve(response.data);
        }, function error(data) {
            console.log(data);
            def.reject(data);
        });

        return def.promise;
    }
        
        return {
            getPlayerRanking : getPlayerRanking,
            getById : getById,
            getAmountFriends : getAmountFriends,
            getSkills : getSkills,
            changeSex  : changeSex,
            getFriends : getFriends,
            getMatches : getMatches,
            getComments  : getComments,
            addComment  : addComment,
            getClanwar : getClanwar,
            getLevelUpLog : getLevelUpLog,
            uploadHeader : uploadHeader,
            uploadEmblem : uploadEmblem,
            isOwner : isOwner,
            searchFriends : searchFriends,
            updateAbout : updateAbout,
            removeFriend : removeFriend,
            addSkill : addSkill,
            removeSkill : removeSkill,
            getAll : getAll,
            searchAll : searchAll,
            getSearchPlayerRanking : getSearchPlayerRanking
        };
    }]);