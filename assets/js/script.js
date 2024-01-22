// Enables functionality for dropdown menus
$('.ui.dropdown')
  .dropdown();

//news associated variables
var APIKey = "3d535884f42f455f9f5e3299842beecb";
var keywordInput = document.getElementById("keyword");
var cityInput = document.getElementById("city");
var countryInput = document.getElementById("country");
var radiusInput = document.getElementById("radius");
var searchBtn = document.getElementById("search-btn");

//getting the date from 7 days ago, to keep news articles current
var currentDate = new Date();
var lastWeekDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
console.log(lastWeekDate);


// Parameters:
// [number]
// [text]
// [sort-direction] ASC or DESC
// [location-filter] - latitude, longitude, radius

// error code 402 for call limit
// error code 429 for exceeding 60 requests

// event listener on the search button click
searchBtn.addEventListener("click", handleSearchEvent);

function handleSearchEvent() {
  var keyword = keywordInput.value.trim();
  var cityName = cityInput.value.trim();
  var countryName = countryInput.value.trim();
  var radius = radiusInput.value;

  // checking the if countryName input is VALID 
  // Using validateCountry function (below this) to do so (json library use)

  validateCountry(countryName);
  //if it returns false from validateCountry function we have an alert
  // and our function returns ie STOPS
  var isCountryValid = validateCountry(countryName);

  if (!isCountryValid) {
    alert("invalid country, please enter a valid country or check spelling")
    return;
  }

  // CANNOT FIND A CITY LIBRARY CURRENTLY future development
  // checking the if cityName input is VALID 
  // Using  validateCity function (below this) to do so (json library use)
  validateCity(cityName);
  
  //if it returns false from  validateCity function we have an alert
  // and our function returns ie STOPS
  var isCityValid =  validateCity(cityName);

  if (!isCityValid) {
    alert("invalid city, please enter a valid city or check spelling")
    return;
  }
  // send this input over to create call url function
  getGeoNewsApi(cityName, countryName);

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
function  validateCity(cityName) {
  return true;  //LIBRARY CODE NOT WORKING- return true automatically for MVP
  // var cityList = city.names();

  // if (!cityList.includes(cityName)) {
  //   return false;
  // }
  // else {
  //   return true;}
  
   
};

//using the news API to create the geo lat and lon 
// coordinates for the location filder in the main api call
async function getGeoNewsApi(cityName, countryName) {

  var newsGeoUrl = `https://api.worldnewsapi.com/geo-coordinates?api-key=${APIKey}&location=${encodeURIComponent(cityName)},${encodeURIComponent(countryName)}`
  console.log(newsGeoUrl);

  var response = await fetch(newsGeoUrl);
  var data = await response.json();
  console.log(data);
  // .then(function (response) {
  //   if (response.ok) {
  //     console.log(response);
  //     return response.json()

  //   } else {
  //     throw new error("Network response not okay");
  //   }
  // })

  // .then(function (data) {
  //   console.log(data);
  //   latestNews(data)
  // })

  // .catch(function (error) {
  //   console.error("fetch opeation failed, error.message");
  //   alert("Unable to connect to location data, check spelling")
  // });
  createCallUrl();
};


//getting the api string from the user input
function createCallUrl() {

  //query url is generated dynamically based on user request
  //inbuilt is the apikey, using teh language english, and the current date range to ensure current news
  var queryURL = `https://api.worldnewsapi.com/search-news?api-key=${APIKey}&language=en`;

  //ecode URI cmponent ensures that the input is concatenated correctly to the URL
  //this uses teh input value of the keyword user input
  // if (keyword) {
  //   queryURL += `&text=${encodeURIComponent(keyword)}`;
  // }

  //  //ecode URI component ensures that the input is concatenated correctly to the URL
  // //this uses the input value of the radius user input as well as the lat and lon from the google map function
  // if (radius) {
  //   queryURL += `&location-filter=${lat},${lon},${encodeURIComponent(radius)}`
  // } else {
  //   queryURL += `&location-filter=${lat, lon}`
  // };

  //log what is being called 
  console.log(queryURL);
  //launch getDataAPi and pass in the queryURL
  getDataApi(queryURL);

}

// This is the api call using the queryURL concatenated above from user input
async function getDataApi(queryURL) {

  var newsResponse = await fetch(queryURL)
  var newsData = await newsResponse.json();
  console.log(newsData);

  // .then(function (response) {
  //     if (response.ok) {
  //       console.log(response);
  //       return response.json()

  //     } else {
  //       throw new error("Network response not okay");
  //     }
  //   })

  //   .then(function (data) {
  //     console.log(data);
  //     latestNews(data)
  //   })

  //   .catch(function (error) {
  //     console.error("fetch opeation failed, error.message");
  //     alert("Unable to connect to headlines, try again later")
  //   });
};

