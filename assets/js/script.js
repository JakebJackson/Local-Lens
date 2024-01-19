var APIKey = "3d535884f42f455f9f5e3299842beecb";
var keywordInput= document.getElementById("keyword");
var radiusInput= document.getElementById("radius");


// Parameters:
// [number]
// [text]
// [sort-direction] ASC or DESC
// [location-filter] - latitude, longitude, radius

// error code 402 for call limit
// error code 429 for exceeding 60 requests

//getting the api string from the user input
function createCallIUrl(lat, lon) {

    var queryURL = `https://api.worldnewsapi.com/search-news?api-key=${APIKey}`;

    if (keywordInput.value) {
        queryURL += `&text=${keywordInput}`;
    }

    if (radiusInput.value) {
        queryURL += `&location-filter=${lat, lon, radiusInput}`
    } else {
        queryURL += `&location-filter=${lat, lon}`
    };
}

function getDataApi(queryURL) {

    fetch(queryURL)
        .then(function (response) {
            if (response.ok) {
                console.log(response);
                response.json().then(function (data) {
                    console.log(data);
                    latestNews(data) 
                });
            } else {
                alert("Error"+ response.statusText);
            }
        })
        .catch(function (error){
            alert("Unable to connect to headlines, try again later")
        });
    };

// var queryURL = `https://api.worldnewsapi.com/search-news?api-key=${APIKey}&text=${keywordInput}&location-filter${lat, lon, radiusInput}`;
    //function to catch spelling errors goes here
    // if() {
    // }else{
    //     window.alert("please enter a valid city")
    // }