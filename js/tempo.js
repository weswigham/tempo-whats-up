var conf = require('./package.json');
var gui = require('nw.gui');

(function(apiRoot) {
    var Tempo = {};
    
    function noop() {}
    function logop(req) {console.log(req.response);}
    
    var authed = false;
    Tempo.authenticate = function(cb) {
        authed = false;
        
        var newWindow = gui.Window.open(apiRoot+"login.jsp", {
            frame: true,
            toolbar: false,
            width: 850,
            height: 500,
            'always-on-top': true,
            show: true,
            resizable: true
        });
        newWindow.cookies.onChanged.addListener(function(cookieChanged) {
            if (cookieChanged.cause === "overwrite") {
                var cookie = cookieChanged.cookie;
                if (cookie.name === "JSESSIONID") { //Good indicator of a login
                    newWindow.close(true);
                    authed = true;
                    cb();
                }
            }
        });
    };
    
    Tempo.authStatus = function() {
        return authed;
    };
    
    var userEndpoint = apiRoot+"rest/tempo-rest/2.0/user";
    Tempo.getActiveUser = function(cb) {
        WinJS.xhr({
            type: 'GET',
            url: userEndpoint,
            responseType: 'json',
        }).done(
            function(req) {
                cb(req.response);
            }, logop, noop
        ); //We only care about success
    };
    
    var issueEndpoint = apiRoot+"rest/api/2/issue/";
    Tempo.getIssue = function (key, cb) {
        var issueUrl = issueEndpoint+key;
        
        WinJS.xhr({
            type: 'GET',
            url: issueUrl,
            responseType: 'json',
        }).done(
            function(req) {
                cb(req.response);
            }, logop, noop
        ); //We only care about success
    };
    
    var newIssueEndpoint = apiRoot+"rest/api/2/issue";
    Tempo.postNewIssue = function (fields, cb) {
        var request = {};
        request.fields = fields;
    
        WinJS.xhr({
            type: 'POST',
            url: newIssueEndpoint,
            responseType: 'json',
            data: request,
            headers: { "Content-type": "application/json" }
        }).done(
            function(req) {
                cb(req.response);
            }, logop, noop
        ); //We only care about success
    };
    
    Tempo.addTime = function(key, time, message, cb) {
        var addTimeEndpoint = issueEndpoint+key+"/worklog";
        var timekey = "timeSpentSeconds";
        if (time instanceof String) {
            timekey = "timeSpent";
        }
        
        var request = {};
        request[timekey] = time;
        request.comment = message;
        
        WinJS.xhr({
            type: 'POST',
            url: addTimeEndpoint,
            responseType: 'json',
            data: request,
            headers: { "Content-type": "application/json" }
        }).done(
            function(req) {
                cb(req.response);
            }, logop, noop
        ); //We only care about success
    };
    
    
    if (window) {
        window.Tempo = Tempo;
    }
    
    return Tempo;
})(conf.settings.jira);