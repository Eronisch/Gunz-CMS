var CharacterService = require('./../../services/server/CharacterService.js');
var ClanService = require('./../../services/server/ClanService.js');
var ServerStatusService = require('./../../services/server/ServerStatusService.js');

exports.index = function (req, res) {
    res.render('index.html');
};

exports.launcher = function (req, res) {
    Promise.all([CharacterService.getPlayerRanking(1, 5), ClanService.getRanking(1, 5), ServerStatusService.getStatus()]).then(function(data){
        res.render('launcher.html', {
            statistics : data[2],
            players : data[0],
            clans : data[1]
        });
    }).catch(next);
};
