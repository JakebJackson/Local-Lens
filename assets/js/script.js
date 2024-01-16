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

var searchBtn = $('#search-btn');

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
  return map;
}

// Calls the initMap function.
initMap();

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
    position: { lat: markerLat, lng: markerLon},
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




// Saving user input variables from the HTML input.

// Using saved variables to talk to the Geocode API, this should generate a map on the page that shows the selected area by the user (example if user inputs postcode 3337 the map will show melton.)

// Using saved variables to get property listing information from the domain portal API to generate markers on the geocode API showing where available properties are within the user-specified area.

// Use returned results from the Domain portal API to display the returned listings in a HTML container below the map for more in-depth information. This should respond to when the user clicks on the map markers and shows the corresponding property. (HTML <map> elements might be useful here.)

// A 'Save Insight' button on selected listings to save the listing to localstorage and generate later in the saved-insights page.

// localstorage.getItem() logic for loading the users saved insights the saved-insights page on load.