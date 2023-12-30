var APIkey = '1f80b8af2888d6e151496d24599cf0ad';
var searchButton = document.getElementById('button-search');
var selectedCity = document.getElementById('selected-city');
var seletedState= document.getElementById('state');
var selectedCountry = document.getElementById('country');
var dateToday = document.getElementById('dateToday');
var inputCity = document.getElementById('search')
var queryURL; 
var listItem = document.querySelectorAll('.list-item');
// var coordinates = [47.6038321, -122.330062];
var coordinates = [];

dateToday.textContent = dayjs().format('M/DD/YYYY');

$( function() {
    $( "#sortable" ).sortable({
      placeholder: "ui-state-highlight"
    });
    $( "#sortable" ).disableSelection();
  } );


function getCoordinates(city){
    var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + APIkey;
    return fetch(geocodeURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            seletedState.textContent = data[0]["state"];
            selectedCountry.textContent = data[0]["country"];
            console.log("lat: ", data[0]["lat"]);
            console.log("lon: ", data[0]["lon"]);
            coordinates = [data[0]["lat"], data[0]["lon"]];  //latitude and longitude coordinates as an array
        }
        
        );
}

function getWeather(city) {
    selectedCity.textContent = city;
    getCoordinates(city);
    fiveDayForecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates[0] + '&lon=' + coordinates[1] + '&appid=' + APIkey;
    fetch(fiveDayForecastURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("fiveDayForecast data: ", data);

        });


    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";
    fetch(queryURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // console.log(data);
            // console.log("current API temp: ", data["main"]["temp"]);

        });
}

getWeather(selectedCity.textContent);

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    console.log("inputCity.value: ", inputCity.value);
    getWeather(inputCity.value);
});

listItem.forEach(function(city) {
    city.addEventListener('click', function() {
        console.log('city clicked:', city.textContent);
        getWeather(city.textContent);
    });
});

//////////Set the 5-day forecast date fields//////////////////////
var today = new Date();  // Get the current date
var cardDates = document.querySelectorAll('.card-date');
cardDates.forEach(function(cardDate, index) {
    // Calculate the date for each card (t+1, t+2, etc.)
    var futureDate = new Date(today);
    futureDate.setDate(today.getDate() + index + 1);

    // Format the date as MM/DD/YYYY
    var formattedDate = (futureDate.getMonth() + 1) + '/' + futureDate.getDate() + '/' + futureDate.getFullYear();

    // Set the text content of the card date
    cardDate.textContent = formattedDate;
});