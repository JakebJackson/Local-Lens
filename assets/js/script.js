// Enables functionality for dropdown menus
$('.ui.dropdown')
  .dropdown();

$('.mini.modal')
  .modal()
  ;


// JOBS API VARS
var APIKey = "c08910fbb16aa0e997cc52bfa37c4935";
var applicationID = "89225970";
var jobsData; //establishing global variable for API call
var keyword;
var cityName;
var countryName;
var radius;
var countryCode;
// ELEMENT VARIABLES
var keywordInput = document.getElementById("keyword");
var cityInput = document.getElementById("city");
var countryInput = document.getElementById("country");
var radiusInput = document.getElementById("radius");
var searchBtn = document.getElementById("search-btn");
var publish = document.getElementById("publish-jobs");
var cardsDiv = document.getElementById('cards-div');
// GLOBAL MAP API VARIABLES
var markerLat;
var markerLon;
var userZoom = 10;
var map;
var geocoder;
var userLatLng;
var chosenCity;
var chosenCountry;
var savedNum;
var curNumOfCards = 0;

// LOCAL STORAGE VARIABLES
if (localStorage.getItem("savedNum") != null) {
  savedNum = JSON.parse(localStorage.getItem("savedNum"));
} else {
  savedNum = 0
}

document.addEventListener('DOMContentLoaded', function () {
  // Your function or code here
  initMap();
});

// Initialise map function, uses async prefix to ensure that it loads as the page loads.
async function initMap() {
  // Map variable that waits to be created ones the google.maps.lib has been imported.
  const { Map } = await google.maps.importLibrary("maps");

  // Map generated to the map variable and is shown in the #map HTML div
  map = new Map(document.getElementById("map"), {
    // 'center:' command is used to move the display port to the specified latitude and longitude, I currently have these set to variables for dynamic use.
    center: { lat: -37.803065906344806, lng: 144.9743971087161 },
    // 'zoom' command is also set to a variable for future dynamic use, this is subject to change.
    zoom: userZoom,
    mapTypeId: "roadmap",
    mapId: "myMap",
  });

  // CALLING GEOCODING FUNCTION
  geocoder = new google.maps.Geocoder();

  // Creates a marker from the google maps library for later use.
  marker = new google.maps.Marker({
    map,
  });

  // EVENT LISTENER WHEN MAP IS CLICKED
  map.addListener('click', (e) => {
    // Location refers to the webpage, e to the event (click) and latLang to call the latitude/longitude.
    geocode({ location: e.latLng });
    userLatLng = JSON.parse(JSON.stringify(e.latLng.toJSON(), null, 2));

    geocodeLatLng(geocoder, map);
  });
  return map;
}

// Calls the initMap function.


// This function is used for the geocoding later in the script, for our use it is basically 
// just giving us the ability to return a Lat/Lon from a click.
function geocode(request) {
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      return results;
    })
    // Catch statement on error.
    .catch((e) => {
      console.log("Geocode Error=" + e);
      // $('#geo-error-modal').modal('show'); function needs to be finessed
    });
}

// Function for reverse geocoding, takes a user click, get the Latitude/Longitude of the click event
// and transfers it into a usable city and country for the Job List API call.
function geocodeLatLng(geocoder, map) {
  geocoder
    .geocode({ location: userLatLng })
    .then((response) => {
      // Checks if the click event returrns data
      if (response.results[0]) {
        map.setZoom(11);

        clickEvent = response.results[1];

        if (clickEvent.address_components.length == 7) {
          chosenCity = clickEvent.address_components[2].long_name;
          chosenCountry = clickEvent.address_components[5].short_name;
        } else if (clickEvent.address_components.length > 7) {
          cityIndex = clickEvent.address_components.length - 5;
          countryIndex = clickEvent.address_components.length - 2;
          chosenCity = clickEvent.address_components[cityIndex].long_name;
          chosenCountry = clickEvent.address_components[countryIndex].short_name;
        } else {
          cityIndex = -5 + clickEvent.address_components.length;
          countryIndex = -2 + clickEvent.address_components.length;
          chosenCity = clickEvent.address_components[cityIndex].long_name;
          chosenCountry = clickEvent.address_components[countryIndex].short_name;
        }

        // The following converts the variables into formatting usable in the API call.
        keyword = keywordInput.value.trim();
        countryCode = chosenCountry.toLowerCase();
        cityName = chosenCity;
        radius = 20;

        // Calls the function to make the call and parses the relevant variables.
        createCallUrl(countryCode, keyword, cityName, radius)

        // If not data returned, display an error alert to the user.
      } else {
        console.log("error with geocode");
        $('#no-jobs-modal').modal('show'); 
      }
    })
    // Catch statement for further errors.
    .catch((e) => console.log("Geocoder failed due to: " + e));
}

// This function is called when the search button is clicked by the user.
async function markerTest() {

  // These will be dynamic variables but are hard coded for now due to testing.
  markerLat = userLatLng.lat;
  markerLon = userLatLng.lng;

  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  // Creates a new map marker 
  const marker = new AdvancedMarkerElement({
    map: map,
    position: { lat: markerLat, lng: markerLon },
    title: "Selected Area",
  });

  // Logs marker created.
  console.log("Marker created");
}

// event listener on the search button click
searchBtn.addEventListener("click", handleSearchEvent);

function handleSearchEvent() {
  keyword = keywordInput.value.trim();
  cityName = cityInput.value.trim();
  countryName = countryInput.value.trim();
  radius = radiusInput.value;
  countryCode = (countryList.code(countryName)).toLowerCase(); //gets country ISO from JSON library

  // checking the if countryName input is VALID 
  // Using validateCountry function (below this) to do so (json library use)
  validateCountry(countryName);
  //if it returns false from validateCountry function we have a console logging the error- further work required
  // and our function returns ie STOPS
  var isCountryValid = validateCountry(countryName);

  if (!isCountryValid) {
    console.log("invalid country, please enter a valid country or check spelling")
    return;
  }

  // handles if the incorrect city is entered ie. it does not exist. returns after so that incorrect city is not displayed
  if (!countryName) {
    console.logs("Please enter a valid Country")
    return
  }

  // CANNOT FIND A CITY LIBRARY CURRENTLY future development
  // checking the if cityName input is VALID 
  // Using  validateCity function (below this) to do so (json library use)
  validateCity(cityName);

  //if it returns false from  validateCity function we have a console logging the error- further work required
  // and our function returns ie STOPS
  var isCityValid = validateCity(cityName);

  if (!isCityValid) {
    console.log("invalid city, please enter a valid city or check spelling")
    return;
  }
  // send this input over to create call url function
  createCallUrl(countryCode, keyword, cityName, radius);

  return;
}

//function for determining if the country is VALID (or correctly spelled)  usinng json library
// countryName parameter has been parsed through handleSearchEvent where this function is used 
function validateCountry(countryName) {
  return true;  //LIBRARY CODE NOT WORKING- return true automatically for MVP
  // var countryList = country.names();

  // if (!countryList.includes(countryName)) {
  //   return false;
  // }
  // else {
  //   return true;
  // }
};

//function for determining if the city is VALID (or correctly spelled)  usinng json library
// cityName parameter has been parsed through handleSearchEvent where this function is used 
// CANNOT FIND CITY LIBRARY
function validateCity(cityName) {
  return true;  //LIBRARY CODE NOT WORKING- return true automatically for MVP
  // var cityList = city.names();

  // if (!cityList.includes(cityName)) {
  //   return false;
  // }
  // else {
  //   return true;}
};

//getting the api string from the user input
function createCallUrl(countryCode, keyword, cityName, radius) {

  //query url is generated dynamically based on user request
  //inbuilt is the APIkey, using language english, limit return to 10 articles
  // and the current date range to ensure current news
  var queryURL = `https://api.adzuna.com/v1/api/jobs/${countryCode}/search/1?app_id=${applicationID}&app_key=${APIKey}&results_per_page=10`;

  // encodeURIComponent ensures that the input is concatenated correctly to the URL
  // this uses teh input value of the keyword user input
  if (keyword) {
    queryURL += `&what=${encodeURIComponent(keyword)}`;
  }

  if (cityName) {
    queryURL += `&where=${encodeURIComponent(cityName)}`;
  }
  //ecode URI component ensures that the input is concatenated correctly to the URL
  //this uses the input value of the radius user input as well as the lat and lon from the google map function
  if (radius) {
    queryURL += `&distance=${encodeURIComponent(radius)}`
  };

  //log what is being called 
  console.log(queryURL);
  //launch getDataAPi and pass in the queryURL
  getDataApi(queryURL);
}

// This is the api call using the queryURL concatenated above from user input
async function getDataApi(queryURL) {
  jobsResponse = await fetch(queryURL);
  jobsData = await jobsResponse.json();
  publishArticles(jobsData)
  // if there are no jobs returned set an alert
  if (jobsData.results == 0) { $('#no-jobs-modal').modal('show'); };
  console.log("jobsData=", jobsData) //to check data is coming through
};

// get data from api call
function publishArticles(jobsData) {
  var searchResults = jobsData.results;

  if (curNumOfCards) {
    for (i = 0; i < curNumOfCards; i++) {
      var removeCard = document.getElementById('card' + i);
      removeCard.remove();
    }
    curNumOfCards = 0;
  }
  // for loop for dynamically populating the HTML elements with the returned data until the loop runs out of job listings.
  for (var i = 0; i < (searchResults.length); i++) {
    // Filters through data to create relevant variables.
    var jobTitle = searchResults[i].title || "n/a";
    var company = searchResults[i].company.display_name || "n/a";
    var dateCreated = searchResults[i].created || "n/a";
    var jobDescription = searchResults[i].description || "n/a";
    var jobLink = searchResults[i].redirect_url || "n/a";
    // Makes sure that the job description does not exceed 150 chars.
    jobDescription = jobDescription.substr(0, 149) + "...";


    var newCardDiv = document.createElement('div');
    newCardDiv.setAttribute('id', 'card' + i);
    newCardDiv.setAttribute('class', 'card');
    cardsDiv.appendChild(newCardDiv);

    var contentDiv = document.createElement('div');
    contentDiv.setAttribute('class', 'content');
    newCardDiv.appendChild(contentDiv);

    // Create anchor element for the job ling
    var jobLinkElement = document.createElement('a');
    jobLinkElement.href = jobLink;


    // Create h3 element for job title
    var jobTitleElement = document.createElement('h3');
    jobTitleElement.textContent = jobTitle;

    // Append the job link element to the jobTitleElement
    jobLinkElement.appendChild(jobTitleElement);

    // Append the jobLinkElement to the jobOutput div
    contentDiv.appendChild(jobLinkElement);

    // Same for the rest
    var companyElement = document.createElement('p');
    companyElement.textContent = 'Company: ' + company;
    contentDiv.appendChild(companyElement);

    var dateCreatedElement = document.createElement('p');
    dateCreatedElement.textContent = 'Date Created: ' + dateCreated;
    contentDiv.appendChild(dateCreatedElement);

    var jobDescriptionElement = document.createElement('p');
    jobDescriptionElement.textContent = jobDescription;
    contentDiv.appendChild(jobDescriptionElement);

    var saveBtnElement = document.createElement('button');
    saveBtnElement.textContent = "Delete";
    saveBtnElement.setAttribute('id', 'delete-btn' + i);
    saveBtnElement.setAttribute('class', 'ui secondary button wide');
    saveBtnElement.setAttribute('onclick', 'saveData(event)');
    contentDiv.appendChild(saveBtnElement);

    // Populates the web page with the filtered data
    $('#card' + i).children('div').children("h3").wrap('<a href="' + jobLink + '"></a>')
    $('#card' + i).children('div').children("a").children("h3").text(jobTitle);
    $('#card' + i).find('.p-company').text(company);
    $('#card' + i).find('.p-date').text(dateCreated);
    $('#card' + i).find('.p-desc').text(jobDescription);
  }
  curNumOfCards = searchResults.length;
};

// LOCAL STORAGE HANDLING
function saveData(event) {
  var savedCard = event.target.parentElement.parentElement.parentElement;
  console.log(savedCard);

  event.target.classList.remove("primary");
  event.target.classList.add("active");

  var savedJob = {
    jobTitle: savedCard.querySelector('h3').textContent,
    jobLink: savedCard.querySelector('a').getAttribute('href'),
    company: savedCard.querySelector('.p-company').textContent,
    dateCreated: savedCard.querySelector('.p-date').textContent,
    jobDescription: savedCard.querySelector('.p-desc').textContent
  };

  localStorage.setItem("savedJob" + savedNum, JSON.stringify(savedJob));

  savedNum++
  localStorage.setItem("savedNum", savedNum);
}

