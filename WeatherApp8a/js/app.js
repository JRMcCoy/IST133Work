"use strict";

function MyApp() {
    var version = "v1.0";
    var widgetReference;
    var widgetObject;

    function setStatus(message) {
        $("#app>footer").text(message);
    }

    this.start = function () {

        widgetReference = $(WeatherWidget);
        widgetObject = new WeatherWidget(widgetReference);

        $("#getWeather").click(function () {
            widgetObject.update();
        });

        $("#app>header").append(version);
        setStatus("ready");
    };
}


$(function () {
    window.app = new MyApp();
    window.app.start();
});
