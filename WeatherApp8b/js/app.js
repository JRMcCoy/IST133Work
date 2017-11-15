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
            getLocation();
        });

        $("#app>header").append(version);
        setStatus("ready");
    };

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    $("#latitude").val(position.coords.latitude);
                    $("#longitude").val(position.coords.longitude);
                },
                function (error) {
                    $("#controls .error").text("ERROR: " + error.message).slideDown();
                }
            );
        }   
    }
}


$(function () {
    window.app = new MyApp();
    window.app.start();
});
