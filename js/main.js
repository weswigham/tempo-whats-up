var aspectRatio = 4;

WinJS.Application.onready = function() {
    WinJS.UI.processAll(document.body).done(function() {
        var textInputBinding = WinJS.Binding.as({ text: "What are you working on?" });

        var textOutput = document.querySelector(".primary-text-binding");
        var container = document.querySelector(".container");
        var hiddenText = document.querySelector(".textarea");

        function onTextChanged(newValue, oldValue) {
            if (!textOutput.firstChild) {
                textOutput.appendChild(document.createTextNode("_"));
            }
            textOutput.firstChild.textContent = newValue;

            container.scrollLeft = container.scrollWidth;
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
            console.log("window refocused");
        });
        container.addEventListener("click", function() {
            hiddenText.focus(); //Give focus to textarea
        });

        // Load native UI library
        var gui = require('nw.gui');

        // Get the current window
        var win = gui.Window.get();
        win.on("close", function () { 
            //TODO: Commit any pending time
            this.close(true);
        });
        
        hiddenText.focus();
    });
};
WinJS.Application.start();