var aspectRatio = 4;

WinJS.Application.onready = function() {
    WinJS.UI.processAll(document.body).done(function() {
        var textInputBinding = WinJS.Binding.as({ text: "What are you working on?" });

        var textOutput = document.querySelector(".primary-text-binding");
        var container = document.querySelector(".container");

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
            document.querySelector(".textarea").focus();
        });
        document.querySelector(".textarea").addEventListener("blur", function(e) {
            e.preventDefault();
        });
        document.querySelector(".primary-text-binding").addEventListener("click", function() {
            document.querySelector(".textarea").focus(); //Give focus to textarea
        });

        document.querySelector(".textarea").focus();

        document.querySelector(".textarea").addEventListener("focus", function(e) {
            e.preventDefault();
        });
    });
};
WinJS.Application.start();