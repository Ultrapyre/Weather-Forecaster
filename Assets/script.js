//Add the various website bits that make the js file actually act.
var searchButton = document.getElementById("search-button");
var searchInput = document.getElementById("search-input");


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

function weatherFetch(city){
    //An API Key, ready for use in server calls. Very unsecure.
    var APIKey = "95aec1e1c037bd2e0c6e17f3143bda3d";
    var queryURL = "api.openweathermap.org/data/2.5/weather?q="+city+"&appid="+APIKey;
}