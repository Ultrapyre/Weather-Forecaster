//Add the various website bits that make the js file actually act.
var searchButton = document.getElementById("search-button");
var searchInput = document.getElementById("search-input");
var forecastToday = document.getElementById("forecast-today");
var weatherIcon = document.createElement("img");
var forecastCity = document.getElementById("forecast-city");
var forecasts = document.getElementById("forecasts");
forecastCity.appendChild(weatherIcon);

//Triggers the function to fetch the weather when the button's pressed.
searchButton.addEventListener("click", function(){
    city = searchInput.value;
    if (city){
        weatherFetch(city);
    }
    else{
        console.log("No input detected!");
    }
})

//This function's the fun part. 
function weatherFetch(city){
    //An API Key, ready for use in server calls. Very unsecure.
    var APIKey = "95aec1e1c037bd2e0c6e17f3143bda3d";
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+APIKey+"&units=metric";

    //Fetch today's weather at the current moment and outputs it on the screen.
    fetch(queryURL)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    console.log(data);

    weatherIcon.src="http://openweathermap.org/img/w/"+ data.weather[0].icon +".png"
    date = new Date(data.dt*1000)
    console.log(forecastToday.children[0].children[0])
    forecastToday.children[0].textContent = data.name + " ("+date.toLocaleDateString("en-US")+")";
    forecastToday.children[1].textContent = "Current Temperature: " + data.main.temp + "°C";
    forecastToday.children[2].textContent = "Wind: " + data.wind.speed + " MPH";
    forecastToday.children[3].textContent = "Humidity: " + data.main.humidity + "%";
    forecastCity.appendChild(weatherIcon);
    });

    //Fetch the forecast for that city in the next five days.

    queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+APIKey+"&units=metric";
    fetch(queryURL)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
        console.log(data);
        for (i=2;i<data.list.length;i=i+8){
            var forecastDay = document.createElement("div");

            var forecastDate = document.createElement("h3");
            var forecastWeatherIcon = document.createElement("img");
            var forecastTemperature = document.createElement("p");
            var forecastWind = document.createElement("p");
            var forecastHumidity = document.createElement("p");

            date = new Date(data.list[i].dt*1000)
            forecastDate.textContent = date.toLocaleDateString("en-US")
            forecastWeatherIcon.src="http://openweathermap.org/img/w/"+ data.list[i].weather[0].icon +".png"
            forecastTemperature.textContent = "Temperature: " + data.list[i].main.temp + "°C";
            forecastWind.textContent = "Wind: " + data.list[i].wind.speed + " MPH";
            forecastHumidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";

            forecastDay.appendChild(forecastDate);
            forecastDay.appendChild(forecastWeatherIcon);
            forecastDay.appendChild(forecastTemperature);
            forecastDay.appendChild(forecastWind);
            forecastDay.appendChild(forecastHumidity);

            forecasts.appendChild(forecastDay);
        }
    });
}