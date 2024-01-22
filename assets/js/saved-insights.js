var jobOutput = document.getElementById("job-output");
var storedSaveJob = localStorage.getItem("job");

var articleURLOutput = document.getElementById("saved-article-URL-output");
var storedArticle = localStorage.getItem("articleURL");

var articleDatePublishedOutput = document.getElementById("saved-article-date-output");
var storedDatePublished = document.getElementById("articleDatePublished");

// Job Local Storage Function to retrieve data from Local Storage
function displayStoredJob() {

    if (storedSaveJob) {
        jobOutput.textContent = "Job:" + JSON.parse(storedSaveJob);
    }
}

displayStoredJob();


// Article URL Local Storge Function to retrieve data from Local Storage
function displayStoredArticle () {

    if (storedArticle) {
        articleURLOutput.textContent = "Article URL:" + JSON.parse(storedArticle);
    }
}

displayStoredArticle();


//Article Date Published Local Storage Function to retrieve data from Local Storage
function displayStoredDatePublished() {

    if (storedDatePublished) {
        articleDatePublishedOutput.textContent = "Date Published:" + JSON.parse(storedDatePublished);
    }
}

displayStoredDatePublished();
