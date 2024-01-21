// Enables functionality for dropdown menus
$('.ui.dropdown')
  .dropdown();

// Basic global variables for use in functions (subject to change most of these are for testing.)
var userLat = -37.803065906344806;
var userLon = 144.9743971087161;
var markerLat;
var markerLon;
var userZoom = 10;
var map;
var geocoder;
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

// Initialise map function, uses async prefix to ensure that it loads as the page loads.
async function initMap() {
  // Map variable that waits to be created ones the google.maps.lib has been imported.
  const { Map } = await google.maps.importLibrary("maps");

  // Map generated to the map variable and is shown in the #map HTML div
  map = new Map(document.getElementById("map"), {
    // 'center:' command is used to move the display port to the specified latitude and longitude, I currently have these set to variables for dynamic use.
    center: { lat: userLat, lng: userLon },
    // 'zoom' command is also set to a variable for future dynamic use, this is subject to change.
    zoom: userZoom,
    mapTypeId: "roadmap",
    mapId: "myMap",
  });

  // CALLING GEOCODING FUNCTION
  geocoder = new google.maps.Geocoder();

  marker = new google.maps.Marker({
    map,
  });

  // EVEMT LISTENER WHEN MAP IS CLICKED
  map.addListener("click", (e) => {
    geocode({ location: e.latLng });
  });
  return map;
}

// NEED TO TRANSLATE THIS FOR THE CURRENT MAP
function geocode(request) {
  // CLEAR FUNCTION: clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });

  
}

// This function is called when the search button is clicked by the user.
async function markerTest() {

  // These will be dynamic variables but are hard coded for now due to testing.
  markerLat = -37.65779823117258;
  markerLon = 144.59184743120363;

  var markerLat2 = -37.634760969408376;
  var markerLon2 = 145.023630480613;

  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  // Creates a new map marker 
  const marker = new AdvancedMarkerElement({
    map: map,
    position: { lat: markerLat, lng: markerLon },
    title: "House",
  });

  // Logs marker created.
  console.log("Marker created");

  // Creates a div in the map element, used to display the marker.
  const housePrice1 = document.createElement("div");

  // Adds 'price-tag' class to the div created above.
  housePrice1.className = "price-tag";
  // Sets text content of the div created above.
  housePrice1.textContent = "Epping, House, $725K";

  // Creates a new marker with the relevant input to display on the map.
  const marker2 = new AdvancedMarkerElement({
    map,
    position: { lat: markerLat2, lng: markerLon2 },
    content: housePrice1,
  });
}

// AUTO COMPLETE CODE
const center = { lat: 50.064192, lng: -130.605469 };
// Create a bounding box with sides ~10km away from the center point
const defaultBounds = {
  north: center.lat + 0.1,
  south: center.lat - 0.1,
  east: center.lng + 0.1,
  west: center.lng - 0.1,
};

//autofill to city input fields
const cityOptions = {
  bounds: defaultBounds,
  fields: ["address_components", "geometry", "icon", "name"],
  types:["(cities)"], //restricts search to cities
  strictBounds: false
};

const cityAutocomplete = new google.maps.places.Autocomplete(cityInput, cityOptions);

//autofill for country input fields
const countryOptions = {
  bounds: defaultBounds,
  fields: ["address_components", "geometry", "icon", "name"],
  types:["(countries)"], //restricts search to countries
  strictBounds: false
};

const countryAutocomplete = new google.maps.places.Autocomplete(countryInput, countryOptions);


// Calls the initMap function.
initMap();



// Parameters:
// [number]
// [text]
// [sort-direction] ASC or DESC
// [location-filter] - latitude, longitude, radius

// error code 402 for call limit
// error code 429 for exceeding 60 requests

// event listener on the search button click
searchBtn.addEventListener("click", handleSearchEvent);

function handleSearchEvent(){
  var keyword = keywordInput.value;
  var city = cityInput.value;
  var country = countryInput.value;
  var radius = radiusInput.value;

  console.log(keyword, city, country, radius);

// createCallUrl(keyword, city, country, radius);
}

//getting the api string from the user input
function createCallUrl(lat, lon) {

  //query url is generated dynamically based on user request
  //inbuilt is the apikey, using teh language english, and the current date range to ensure current news
  var queryURL = `https://api.worldnewsapi.com/search-news?api-key=${APIKey}&language=en`;

  //ecode URI cmponent ensures that the input is concatenated correctly to the URL
  //this uses teh input value of the keyword user input
  if (keywordInput.value) {
    queryURL += `&text=${encodeURIComponent(keywordInput.value)}`;
  }

  //ecode URI component ensures that the input is concatenated correctly to the URL
  //this uses the input value of the radius user input as well as the lat and lon from the google map function
  if (radiusInput.value) {
    queryURL += `&location-filter=${lat},${lon},${encodeURIComponent(radiusInput.value)}`
  } else {
    queryURL += `&location-filter=${lat, lon}`
  };

  //log what is being called 
  console.log(queryURL);
  //launch getDataAPi and pass in the queryURL
  getDataApi(queryURL);

}

function getDataApi(queryURL) {

  fetch(queryURL)
    .then(function (response) {
      if (response.ok) {
        console.log(response);
        return response.json()

      } else {
        throw new error("Network response not okay");
      }
    })

    .then(function (data) {
      console.log(data);
      latestNews(data)
    })

    .catch(function (error) {
      console.error("fetch opeation failed, error.message");
      alert("Unable to connect to headlines, try again later")
    });
};

