function WeatherWidget($widget) {

    this.update = function () {
        $(".results", $widget).hide();
        $(".loading", $widget).show();
        getWeatherReport();
    };

    function getWeatherReport() {
        $.get("data/weather.xml").done(function (data) {
            populateWeather(data);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            showError(errorThrown);
        });
    }

    function populateWeather(data) {
        var $observation = $("current_observation", data);

        $(".results header img", $widget).attr("src", $("icon_url", $observation).text());

        $(".location>span", $widget).text($("location", data).text());

        $(".conditions>span").each(function (i, e) {
            var $span = $(this);
            var field = $span.data("field");
            $(this).text($(field, $observation).text());
        });

        $(".loading", $widget).fadeOut(function () {
            $(".results", $widget).fadeIn();
        });
    }
}