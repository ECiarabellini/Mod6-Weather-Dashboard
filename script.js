var APIkey = '1f80b8af2888d6e151496d24599cf0ad';
var searchButton = document.getElementById('button-search');
var selectedCity = document.getElementById('selected-city');
var selectedState= document.getElementById('state');
var selectedCountry = document.getElementById('country');
var dateToday = document.getElementById('dateToday');
var inputCity = document.getElementById('search')
var listItem = document.querySelectorAll('.list-item');
var todayTemp = document.getElementById('today-temp');
var todayWind = document.getElementById('today-wind');
var todayHumidity = document.getElementById('today-humidity');
var todayEmoji = document.getElementById('today-emoji');
//var coordinates = [47.6038321, -122.330062]; //Seattle coordinates for testing purposes
//var coordinates = [39.7392364, -104.984862]; //Denver coordinates for testing purposes
var coordinates = [];
var errorSection = document.getElementById('section-error');
var weatherSection = document.getElementById('section-weather');
let tZeroimg = document.querySelector("#tZero img");
let tPlus1img = document.querySelector("#tPlus1 img");
let tPlus2img = document.querySelector("#tPlus2 img");
let tPlus3img = document.querySelector("#tPlus3 img");
let tPlus4img = document.querySelector("#tPlus4 img");
let tZerotemp = document.querySelector("#tZero .temp span");
let tPlus1temp = document.querySelector("#tPlus1 .temp span");
let tPlus2temp = document.querySelector("#tPlus2 .temp span");
let tPlus3temp = document.querySelector("#tPlus3 .temp span");
let tPlus4temp = document.querySelector("#tPlus4 .temp span");
let tZerowind = document.querySelector("#tZero .wind span");
let tPlus1wind = document.querySelector("#tPlus1 .wind span");
let tPlus2wind = document.querySelector("#tPlus2 .wind span");
let tPlus3wind = document.querySelector("#tPlus3 .wind span");
let tPlus4wind = document.querySelector("#tPlus4 .wind span");
let tZerohumid = document.querySelector("#tZero .humidity span");
let tPlus1humid = document.querySelector("#tPlus1 .humidity span");
let tPlus2humid = document.querySelector("#tPlus2 .humidity span");
let tPlus3humid = document.querySelector("#tPlus3 .humidity span");
let tPlus4humid = document.querySelector("#tPlus4 .humidity span");
var searchHistoryList = document.getElementById('sortable');
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || []; //initialize an empty array if doesn't yet exist in local storage

dateToday.textContent = dayjs().format('M/DD/YYYY');

///copied from jQuery sortable///
$( function() {
    $( "#sortable" ).sortable({
      placeholder: "ui-state-highlight"
    });
    $( "#sortable" ).disableSelection();
  } );
/////////////////////////////////

function updateSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.push(city);
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        showSearchHistory();
    }
}

function showSearchHistory(){
    searchHistoryList.innerHTML = '';
    searchHistory.forEach(function(city){
        var listItem = document.createElement('li');
        listItem.className = 'ui-state-default list-item';
        listItem.className = 'list-item';
        listItem.textContent = city;
        searchHistoryList.appendChild(listItem);
        listItem.addEventListener('click', function() {
            resetPage();
            getWeather(city);
        });
    })
}

function getWeather(city) {
    selectedCity.textContent = city;
    var geocodeURL = "http://api.openweathermap.org/geo/1.0/direct?q="+ city + "&limit=1&appid=" + APIkey;
    fetch(geocodeURL)
        .then(function (response) {
            console.log(response.status);
            if(response.status != 200){
                console.log("error at geocode fetch!");
                errorReceived();
            } else{
                return response.json();
            }
        })
        .then(function (data) {
            selectedState.textContent = data[0]["state"];
            selectedCountry.textContent = data[0]["country"];
            coordinates = [data[0]["lat"], data[0]["lon"]];  //latitude and longitude coordinates as an array
            fiveDayForecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates[0] + '&lon=' + coordinates[1] + '&appid=' + APIkey + "&units=imperial";
            return fetch(fiveDayForecastURL);
        }) 
        .then(function (response) {
            console.log(response.status);
            if(response.status != 200){
                console.log("error at fiveDayForecast fetch!");
                errorReceived();
            } else{
                return response.json();
            }
        })
        .then(function (data) {
            // console.log("fiveDayForecast data: ", data);
            var todaysDate = new Date();
            todaysDate.setHours(0); //set h/m/s to 0 to calculate date difference correctly below
            todaysDate.setMinutes(0); 
            todaysDate.setSeconds(0); 
            let highTempToday = 0;
            let highTempT1 = 0;
            let highTempT2 = 0;
            let highTempT3 = 0;
            let highTempT4 = 0;
            for (let n = 0; n < data.list.length; n++){
                var formattedDate = new Date(data.list[n]['dt'] *1000); //convert unix timestamp to readible date in local time
                var dateDiff = (formattedDate - todaysDate)/86400000;  ///date difference converted to days. less than 1 is today; 1.x is tomorrow, 2.x is day 3, etc.
                var temp = data.list[n]['main']['temp'];
                var windSpeed = data.list[n]['wind']['speed'];
                var humiditylevel = data.list[n]['main']['humidity'];
                var currentDayIcon = data.list[n]['weather'][0]['icon'];
                var dayimgURL = 'http://openweathermap.org/img/wn/' + currentDayIcon +'@2x.png';
                // console.log('date', n, ': ', formattedDate,' _temp: ',temp, ' _wind:',windSpeed,'_humid',humiditylevel); ////////////////helpful log of 5 day data
                if (dateDiff < 1){
                    if (highTempToday < temp){
                        highTempToday = temp;
                        tZerotemp.textContent = highTempToday;
                        tZerowind.textContent = windSpeed;
                        tZerohumid.textContent = humiditylevel;
                        tZeroimg.src = dayimgURL;
                    }
                }
                if (dateDiff >= 1 && dateDiff < 2){
                    if (highTempT1 < temp){
                        highTempT1 = temp;
                        tPlus1temp.textContent = highTempT1;
                        tPlus1wind.textContent = windSpeed;
                        tPlus1humid.textContent = humiditylevel;
                        tPlus1img.src = dayimgURL;
                    }
                }
                if (dateDiff >= 2 && dateDiff < 3){
                    if (highTempT2 < temp){
                        highTempT2 = temp;
                        tPlus2temp.textContent = highTempT2;
                        tPlus2wind.textContent = windSpeed;
                        tPlus2humid.textContent = humiditylevel;
                        tPlus2img.src = dayimgURL;
                    }
                }
                if (dateDiff >= 3 && dateDiff < 4){
                    if (highTempT3 < temp){
                        highTempT3 = temp;
                        tPlus3temp.textContent = highTempT3;
                        tPlus3wind.textContent = windSpeed;
                        tPlus3humid.textContent = humiditylevel;
                        tPlus3img.src = dayimgURL;
                    }
                }
                if (dateDiff >= 4 && dateDiff < 5){
                    if (highTempT4 < temp){
                        highTempT4 = temp;
                        tPlus4temp.textContent = highTempT4;
                        tPlus4wind.textContent = windSpeed;
                        tPlus4humid.textContent = humiditylevel;
                        tPlus4img.src = dayimgURL;
                    }
                }
            }            
        });


    var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";
    fetch(currentWeatherURL)
        .then(function (response) {
            console.log(response.status);
            if(response.status != 200){
                console.log("error at currentWeather fetch!");
                errorReceived();
            } else{
                return response.json();
            }
        })
        .then(function (data) {
            todayTemp.textContent = data["main"]["temp"];            
            todayWind.textContent = data["wind"]["speed"];
            todayHumidity.textContent = data["main"]["humidity"];
            let currentIcon = data['weather'][0]['icon']; 
            var imgURL = 'http://openweathermap.org/img/wn/' + currentIcon +'@2x.png';
            todayEmoji.src = imgURL;


        });
}

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    resetPage();
    getWeather(inputCity.value);
    updateSearchHistory(inputCity.value);
});

getWeather(selectedCity.textContent);
showSearchHistory();

//////////Set the 5-day forecast date fields//////////////////////
var today = new Date();  // Get the current date
var cardDates = document.querySelectorAll('.card-date');
cardDates.forEach(function(cardDate, index) {
    // Calculate the date for each card (t+1, t+2, etc.)
    var futureDate = new Date(today);
    futureDate.setDate(today.getDate() + index);

    // Format the date as MM/DD/YYYY
    var formattedDate = (futureDate.getMonth() + 1) + '/' + futureDate.getDate() + '/' + futureDate.getFullYear();

    // Set the text content of the card date
    cardDate.textContent = formattedDate;
});


function errorReceived(){
    console.log("errorRecieved function here!")
    errorSection.style.display = "block";
    weatherSection.style.display = "none";
};

function resetPage(){
    console.log("reset!")
    errorSection.style.display = "none";
    weatherSection.style.display = "block";
};