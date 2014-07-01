var conf = require('./package.json');

WinJS.Application.onready = function() {
    WinJS.UI.processAll(document.body).done(function() {
        var textInputBinding = WinJS.Binding.as({ text: "What are you working on?" });

        var textOutput = document.querySelector(".primary-text-binding");
        var container = document.querySelector(".container");
        var hiddenText = document.querySelector(".textarea");
        var inputTimeoutId = null;
        
        var idStartRegex = /([A-Z0-9a-z]+\-[0-9]+): (.*)/;
        var eventQueue = [];
        
        function doRecordText(text, start) {
            return function() {
                var captures = idStartRegex.exec(text);
                var event = {};
                if (captures) {
                    event.type = "addTime";
                    event.key = captures[1];
                    event.message = captures[2];
                } else {
                    event.type = "logMessage";
                    event.message = text;
                }
                event.start = start;
                eventQueue.push(event);
                if (Tempo.authStatus()) {
                    processQueue();
                }
            };
        }
        
        function noop() {}
        
        function simpleNewIssueLog(project, summary, time) {
            Tempo.postNewIssue({
                project: {
                    key: project
                },
                summary: summary
            }, function(resp) {
                if (resp.key) {
                    Tempo.addTime(resp.key, time, "", noop);
                } else {
                    console.log(resp);
                }
            });
        }
        
        function newIssueHandlerProvider(evt, durationSec) {
            return function(resp) {
                if (resp && (resp.errorMessages || resp.errors)) {
                    console.log(resp);
                    simpleNewIssueLog(conf.settings["default-project"], evt.key+": "+evt.message, durationSec);
                    return;
                }

                Tempo.addTime(evt.key, durationSec, evt.message, noop);
            };
        }
        
        function processQueue() {
            while (eventQueue.length > 1) { //Always should have one running event
                var evt = eventQueue[0];
                eventQueue = eventQueue.splice(1);
                var durationMs = eventQueue[0].start - evt.start;
                var durationSec = durationMs/1000;
                switch (evt.type) { //Yeah, I know, could be refactored to use polymorphism
                    case "addTime": 
                        //Check is issue with key exists, if so, update worklog, 
                        //otherwise update message and fallback to a logMessage
                        Tempo.getIssue(evt.key, newIssueHandlerProvider(evt, durationSec));
                        break;
                    case "logMessage":
                        //Make a new issue with our message as the summary
                        simpleNewIssueLog(conf.settings["default-project"], evt.message, durationSec);
                        break;
                    default:
                        console.log("Processed unprocessable event", evt);
                }
            }
        }

        function onTextChanged(newValue) {
            if (!textOutput.firstChild) {
                textOutput.appendChild(document.createTextNode("_"));
            }
            textOutput.firstChild.textContent = newValue;

            container.scrollLeft = container.scrollWidth;
            if (inputTimeoutId !== null) {
                clearTimeout(inputTimeoutId);
            }
            inputTimeoutId = setTimeout(doRecordText(newValue, new Date()), conf.settings.timeout*1000);
        }

        function bindToDataSource() {
            textInputBinding.bind("text", onTextChanged.bind(this));
        }

        function changeListener() {
            textInputBinding.text = this.value;
        }

        function bindToInputChanges() {
            WinJS.Utilities.query(".textarea")
                .listen("keyup", changeListener)
                .listen("change", changeListener)
                .forEach(function (e) {
                    e.value = textInputBinding.text;
                    e.select();
                });
        }

        bindToDataSource();
        bindToInputChanges();

        window.addEventListener("focus", function() {
            hiddenText.focus();
            hiddenText.select();
        });
        container.addEventListener("click", function() {
            hiddenText.focus(); //Give focus to textarea
        });

        // Load native UI library
        var gui = require('nw.gui');

        // Get the current window
        var win = gui.Window.get();
        win.on("close", function () { 
            if (Tempo.authStatus()) {
                eventQueue.push({type: "end", start: new Date()});
                processQueue();
            }
            this.close(true);
        });
        
        hiddenText.focus();
        
        if (!Tempo.authStatus()) {
            Tempo.authenticate(processQueue);
        }
    });
};
WinJS.Application.start();