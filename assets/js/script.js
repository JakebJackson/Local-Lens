// Enables functionality for dropdown menus
$('.ui.dropdown')
  .dropdown();

// Basic global variables for use in functions (subject to change most of these are for testing.)
var markerLat;
var markerLon;
var userZoom = 10;
var map;
var geocoder;
var userLatLng;
var chosenCity;
var chosenCountry;

var searchBtn = $('#search-btn');

// Calls the initMap function.
initMap();

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

  marker = new google.maps.Marker({
    map,
  });
  
  // EVEMT LISTENER WHEN MAP IS CLICKED
  map.addListener('click', (e) => {
    // Location refers to the webpage, e to the event (click) and latLang to call the latitude/longitude.
    geocode({ location: e.latLng });
    userLatLng = JSON.parse(JSON.stringify(e.latLng.toJSON(), null, 2));

    geocodeLatLng(geocoder, map);
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

function geocodeLatLng(geocoder, map) {

  geocoder
    .geocode({ location: userLatLng })
    .then((response) => {
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

        console.log(chosenCity);
        console.log(chosenCountry);
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
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
    position: { lat: markerLat, lng: markerLon},
    title: "Selected Area",
  });

  // Logs marker created.
  console.log("Marker created");
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

const input = document.getElementById("pac-input");
const options = {
  bounds: defaultBounds,
  componentRestrictions: { country: "au" },
  fields: ["address_components", "geometry", "icon", "name"],
  strictBounds: false,
};
const autocomplete = new google.maps.places.Autocomplete(input, options);
