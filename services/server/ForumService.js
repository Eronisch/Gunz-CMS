var ServerContext = require('../../database/ServerContext.js');
var DateService = require('../../tools/DateService.js');

exports.getThreads = getThreads;

function getThreads(forumId){
    return ServerContext.ForumTopicModel.findAll({
        order : 'Timestamp DESC',
        where : {
            ForumId : forumId
        }
    }).then(function(threads){
        if(threads){
            threads.forEach(function(thread){
                thread.dataValues.Date = DateService.getLongDate(thread.Timestamp * 1000);
            });
        }

        return threads;
    })
}