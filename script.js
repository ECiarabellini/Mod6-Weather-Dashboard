var APIkey = '1f80b8af2888d6e151496d24599cf0ad';
var searchButton = document.getElementById('button-search');
var selectedCity = document.getElementById('selected-city');
var dateToday = document.getElementById('dateToday');
var inputCity = document.getElementById('search')
var queryURL;
dateToday.textContent = dayjs().format('M/DD/YYYY');

$( function() {
    $( "#sortable" ).sortable({
      placeholder: "ui-state-highlight"
    });
    $( "#sortable" ).disableSelection();
  } );

function getWeather(city) {
    var requestUrl = queryURL;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);

        });
}

searchButton.addEventListener('click', function(event) {
    event.preventDefault();
    console.log("inputCity.value: ", inputCity.value);
    selectedCity.textContent = inputCity.value;
    console.log("selectedCity.textContent: ", selectedCity.textContent);
    queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + selectedCity.textContent + "&appid=" + APIkey;
    getWeather(selectedCity.textContent);
    console.log(queryURL);
});
