var APIkey = '1f80b8af2888d6e151496d24599cf0ad';
var searchButton = document.getElementById('button-search');
var selectedCity = document.getElementById('selected-city');
var seletedState= document.getElementById('state');
var selectedCountry = document.getElementById('country');
var dateToday = document.getElementById('dateToday');
var inputCity = document.getElementById('search')
var listItem = document.querySelectorAll('.list-item');
var todayTemp = document.getElementById('today-temp');
var todayWind = document.getElementById('today-wind');
var todayHumidity = document.getElementById('today-humidity');
var todayEmoji = document.getElementById('today-emoji');

var coordinates = [47.6038321, -122.330062];
// var coordinates = [];

dateToday.textContent = dayjs().format('M/DD/YYYY');

$( function() {
    $( "#sortable" ).sortable({
      placeholder: "ui-state-highlight"
    });
    $( "#sortable" ).disableSelection();
  } );


// function getCoordinates(city){
//     var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + APIkey;
//     fetch(geocodeURL)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             seletedState.textContent = data[0]["state"];
//             selectedCountry.textContent = data[0]["country"];
//             console.log("lat: ", data[0]["lat"]);
//             console.log("lon: ", data[0]["lon"]);
//             coordinates = [data[0]["lat"], data[0]["lon"]];  //latitude and longitude coordinates as an array
//         }
        
//         );
// }

function getWeather(city) {
    selectedCity.textContent = city;
    // getCoordinates(city);
    var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + APIkey;
    fetch(geocodeURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            seletedState.textContent = data[0]["state"];
            selectedCountry.textContent = data[0]["country"];
            console.log("lat: ", data[0]["lat"]);
            console.log("lon: ", data[0]["lon"]);
            coordinates = [data[0]["lat"], data[0]["lon"]];  //latitude and longitude coordinates as an array
            console.log('coordinates1: ', coordinates);
        }
        );

    console.log('coordinates2: ', coordinates);
    fiveDayForecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates[0] + '&lon=' + coordinates[1] + '&appid=' + APIkey + "&units=imperial";
    console.log('fiveDayForecastURL: ', fiveDayForecastURL);
    fetch(fiveDayForecastURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("fiveDayForecast data: ", data);
            console.log('date0:', data.list[0]['dt_txt']); //in UTC
            console.log('date1:', data.list[1]['dt_txt']);

            var formattedDate = new Date(data.list[0]['dt'] *1000); //convert unix timestamp to readible date in local time
            console.log('date0: ', formattedDate);
            // var formattedDate1 = new Date(dataOne *1000);
            // console.log('date1: ', formattedDate1);

        });


    var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";
    fetch(currentWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("current data: ", data);
            todayTemp.textContent = data["main"]["temp"];
            todayHumidity.textContent = data["main"]["humidity"];
            todayWind.textContent = data["wind"]["speed"];
            todayEmoji.textContent = data['weather'][0]['main']; /////////////////////////////////////fill this in with proper emoji



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



////////
//-- need to figure out how to display high temp for each day (alternatively hardcode temp at certain time?? indexes vary based on when data is run). First temp of the day + index 4?? temp around noon?
//-- need to resolve issue of long/lat coordinates not returning in time for 5-day forecast api call. Soemthing to do with async functions and await