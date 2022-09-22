//Add the various website bits that make the js file actually act.
var searchButton = document.getElementById("search-button");
var searchInput = document.getElementById("search-input");
var forecastToday = document.getElementById("forecast-today");
var weatherIcon = document.createElement("img");
var forecastCity = document.getElementById("forecast-city");
var forecasts = document.getElementById("forecasts");
var searchHistory = document.getElementById("search-history");
forecastCity.appendChild(weatherIcon);


//An API Key, ready for use in server calls. Very unsecure.
var APIKey = "95aec1e1c037bd2e0c6e17f3143bda3d";

//This value is used to stop duplicate fetches from multiple clicks.
//The website wouldn't appreciate being unintentionally DDOS'ed, after all.

var recentQuery = "";

//Triggers the function to fetch the weather when the button's pressed.
searchButton.addEventListener("click", function(){
    city = searchInput.value;
    if (city&&city!=recentQuery){
        recentQuery = city;
        weatherFetch(city);
    }
    else{
        console.log("No input detected!");
    }
})

//Create an array. If any search history is in local storage, fill array.
var searchArray = [];
var savedata = JSON.parse(localStorage.getItem("travels"))
if(savedata){
    searchArray = savedata;
    refreshHistory();
}

//Adds a listener to the search history to trigger any searches when the buttons are pressed.
searchHistory.addEventListener("click", function(event){
    if (event.target.localName == "button"&&event.target.innerText!=recentQuery){
        recentQuery = event.target.innerText;
        weatherFetch(event.target.innerText);
    }
})

//This function's the fun part. 
function weatherFetch(city){
    //Creates a query URL based on the input, and the API Key.
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+APIKey+"&units=metric";

    //Fetch today's weather at the current moment and outputs it on the screen.
    fetch(queryURL)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
    weatherIcon.src="http://openweathermap.org/img/w/"+ data.weather[0].icon +".png"
    date = new Date(data.dt*1000)
    forecastToday.children[0].textContent = data.name + " ("+date.toLocaleDateString("en-US")+")";
    forecastToday.children[1].textContent = "Current Temperature: " + data.main.temp + "°C";
    forecastToday.children[2].textContent = "Wind: " + data.wind.speed + " MPH";
    forecastToday.children[3].textContent = "Humidity: " + data.main.humidity + "%";
    forecastCity.appendChild(weatherIcon);
    
    //Updates the recent query and the data input so fetch requests aren't spammed in multiple clicks.
    recentQuery = data.name;
    searchInput.value = data.name;
    
    //Saves the searched result in an array, if not available.
    //Also gets rid of the last entry if search results exceed 8.
    //Saves the new array into local storage, then refreshes the search history.

    if(!searchArray.includes(data.name)){
        searchArray.unshift(data.name)
        if (searchArray.length > 8){
            searchArray.pop();
        }
        localStorage.setItem("travels", JSON.stringify(searchArray));
        refreshHistory();
    }
    });

    //Fetch the forecast for that city in the next five days.

    queryURL = "https://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid="+APIKey+"&units=metric";
    fetch(queryURL)
    .then(function (response) {
    return response.json();
    })
    .then(function (data) {
        //Removes any forecasts, if any.
        while(forecasts.firstChild){
            forecasts.removeChild(forecasts.firstChild);
        }

        for (i=7;i<data.list.length;i=i+8){
            var forecastDay = document.createElement("div");

            var forecastDate = document.createElement("h3");
            var forecastWeatherIcon = document.createElement("img");
            var forecastTemperature = document.createElement("p");
            var forecastWind = document.createElement("p");
            var forecastHumidity = document.createElement("p");

            date = new Date(data.list[i].dt*1000)
            console.log(date)
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

//Updates the search history with new buttons.
function refreshHistory(){
    //Removes any existing buttons, if any
    while(searchHistory.firstChild){
        searchHistory.removeChild(searchHistory.firstChild);
    }

    //creates a new set of buttons.
    for (i=0;i<searchArray.length;i++){
        var historyButton = document.createElement("button");
        historyButton.textContent = searchArray[i];
        searchHistory.appendChild(historyButton);
    }
}