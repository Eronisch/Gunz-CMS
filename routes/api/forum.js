var express = require('express');
var router = express.Router();
var forumService = require('./../../services/server/ForumService.js');

router.get('/:id/threads', function(request, response, next){
    forumService.getThreads(request.params.id).then(function(data){
        response.send(data);
    }).catch(next);
});

module.exports = router;