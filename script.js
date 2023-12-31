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
var coordinates = [47.6038321, -122.330062]; //Seattle coordinates for testing purposes
// var coordinates = [];
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
            // console.log("lat: ", data[0]["lat"]);
            // console.log("lon: ", data[0]["lon"]);
            coordinates = [data[0]["lat"], data[0]["lon"]];  //latitude and longitude coordinates as an array
            // console.log('coordinates1: ', coordinates);
        }
        ) 
    console.log('coordinates2: ', coordinates);
    fiveDayForecastURL = "http://api.openweathermap.org/data/2.5/forecast?lat=" + coordinates[0] + '&lon=' + coordinates[1] + '&appid=' + APIkey + "&units=imperial";
    console.log('fiveDayForecastURL: ', fiveDayForecastURL);
    fetch(fiveDayForecastURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("fiveDayForecast data: ", data);
            var todaysDate = new Date();
            todaysDate.setHours(0); //set attributes to 0 to calculate days after correctly below
            todaysDate.setMinutes(0); 
            todaysDate.setSeconds(0); 
            console.log('todaysDate: ', todaysDate);
            let highTemp = 0;
            for (let n = 0; n < data.list.length; n++){
                var formattedDate = new Date(data.list[n]['dt'] *1000); //convert unix timestamp to readible date in local time
                var dateDiff = (formattedDate - todaysDate)/86400000;  ///converted to days. less than 1 is today; 1.x is tomorrow, 2.x is day 3, etc.
                var temp = data.list[n]['main']['temp'];
                console.log('date', n, ': ', formattedDate,' _temp: ',temp, ' _wind:',data.list[n]['wind']['speed'],'_humid',data.list[n]['main']['humidity']);
                console.log('highTemp: ', highTemp);
                if (dateDiff < 1){
                    if (highTemp < temp){
                        highTemp = temp;
                        console.log('temp ',temp);
                        tZerotemp.textContent = highTemp;
                        tZerowind.textContent = data.list[n]['wind']['speed'];
                        tZerohumid.textContent = data.list[n]['main']['humidity'];
                        let currentDayIcon = data.list[n]['weather'][0]['icon'];
                        console.log(currentDayIcon);
                        var dayimgURL = 'http://openweathermap.org/img/wn/' + currentDayIcon +'@2x.png'; 
                        console.log('dayimgURL ', dayimgURL);
                        tZeroimg.src = dayimgURL;
                    }
                }
                if (dateDiff < 2){
                    if (highTemp < temp){
                        highTemp = temp;
                        console.log('temp ',temp);
                        tZerotemp.textContent = highTemp;
                        tZerowind.textContent = data.list[n]['wind']['speed'];
                        tZerohumid.textContent = data.list[n]['main']['humidity'];
                    }
                }
            }
            // console.log('date0:', data.list[0]['dt_txt']); //in UTC
            

        });


    var currentWeatherURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIkey + "&units=imperial";
    fetch(currentWeatherURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("current data: ", data);
            todayTemp.textContent = data["main"]["temp"];            
            todayWind.textContent = data["wind"]["speed"];
            todayHumidity.textContent = data["main"]["humidity"];
            let currentIcon = data['weather'][0]['icon']; 
            var imgURL = 'http://openweathermap.org/img/wn/' + currentIcon +'@2x.png';
            todayEmoji.src = imgURL;


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
    futureDate.setDate(today.getDate() + index);

    // Format the date as MM/DD/YYYY
    var formattedDate = (futureDate.getMonth() + 1) + '/' + futureDate.getDate() + '/' + futureDate.getFullYear();

    // Set the text content of the card date
    cardDate.textContent = formattedDate;
});

////////
//-- need to figure out how to display high temp for each day (alternatively hardcode temp at certain time?? indexes vary based on when data is run). First temp of the day + index 4?? temp around noon?
//-- need to resolve issue of long/lat coordinates not returning in time for 5-day forecast api call. Soemthing to do with async functions and await

