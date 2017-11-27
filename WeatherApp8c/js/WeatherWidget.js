function WeatherWidget($widget) {

    this.update = function (locationInfo) {
        $(".results", $widget).hide();
        $(".loading", $widget).show();
        getWeatherReport(locationInfo);
    };

    function getWeatherReport(locationInfo) {
		if (locationInfo == "") return;
		var apiUrl = "https://api.weather.gov/points/" + locationInfo;
		$.ajax({
			url: apiUrl,
			dataType: "json"
		})
		.done(function(data) { displayMetadata(data); })
		.fail(function(jqXHR, textStatus, errorThrown) { handleAjaxError(errorThrown); });
		
		apiUrl += "/forecast";
		$.ajax({
			url: apiUrl,
			dataType: "json"
		})
		.done(function(data) { displayForecast(data); })
		.fail(function(jqXHR, textStatus, errorThrown) { handleAjaxError(errorThrown); });
	}

	function displayMetadata(data) {
		$("#loc").text(data.properties.relativeLocation.properties.city + data.properties.relativeLocation.properties.state);
	}
	
	function displayForecast(data) {
		populateWeather(data);
	}
	
	function handleAjaxError(error) {
		alert(error);
	}

    function populateWeather(data) {

        var observation = data.properties.periods[0];

        $(".results header img", $widget).attr("src", data.properties.periods[0].icon);
		
		$("#conditions").text(observation.shortForecast);
		
		$("#temp").text(observation.temperature + observation.temperatureUnit + " " + observation.temperatureTrend);
		
		$("#wind").text(observation.windSpeed + " " + observation.windDirection);
		
        $(".loading", $widget).fadeOut(function () {
            $(".results", $widget).fadeIn();
        });
    }
}
