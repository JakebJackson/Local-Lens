var APIKey = "3d535884f42f455f9f5e3299842beecb";
var textInput=;
var cityInput =;
var countryInput =;


Parameters:
// [number]
// [text]
// [sort-direction] ASC or DESC
// [location-filter] - latitude, longitude, radius

// error code 402 for call limit
// error code 429 for exceeding 60 requests

function getnewsAPI(){

    //function to catch spelling errors goes here
    // if() {
    // }else{
    //     window.alert("please enter a valid city")
    // }

    var queryURL = `https://api.worldnewsapi.com/search-news?api-key=${APIKey}&text=${text}&location-filter${lat, lon, rad}`;




}