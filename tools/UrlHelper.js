exports.getQueryArray = function(url) {
    var vars = url.split('&');
    var queryArray = [];
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        queryArray.push(decodeURIComponent(pair[1]));
    }

    return queryArray;
};