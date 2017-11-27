"use strict";

function MyApp() {
    var version = "v3.0";
    var widgetReference;
    var widgetObject;
	var locationInfo = "";
	

    function setStatus(message) {
        $("#app>footer").text(message);
    }

    this.start = function () {

		getLocation();
	
        widgetReference = $(WeatherWidget);
        widgetObject = new WeatherWidget(widgetReference);

        $("#getWeather").click(function () {
            widgetObject.update(locationInfo);
        });

        $("#app>header").append(version);
        setStatus("ready");
    };

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
					locationInfo = position.coords.latitude + "," + position.coords.longitude;
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
