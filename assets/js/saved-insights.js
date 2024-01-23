var jobOutput = document.getElementById("job-output");


var articleURLOutput = document.getElementById("saved-article-URL-output");
var storedArticle = localStorage.getItem("articleURL");

var articleDatePublishedOutput = document.getElementById("saved-article-date-output");
var storedDatePublished = document.getElementById("articleDatePublished");

// Checks to see if the user has any saved insights
if ((localStorage.getItem("savedNum"))) {
    savedNum = JSON.parse(localStorage.getItem("savedNum"));
} else {
    // if not updates the savedNum var to 0
    savedNum = 0
    // displays no saved jobs.
    jobOutput.innerText = "No saved jobs!";
}

// Job Local Storage Function to retrieve data from Local Storage
function displayStoredJob() {
    if (savedNum > 0) {
        for (i = 0; i < savedNum; i++) {
            var currentJob = JSON.parse(localStorage.getItem("savedJob" + i))
            console.log(currentJob);
            var currentJobOutputDiv = document.createElement('div');
            currentJobOutputDiv.setAttribute('id', 'savedJob' + i);
            currentJobOutputDiv.setAttribute('class', 'ui raised segment');
            jobOutput.appendChild(currentJobOutputDiv);

            // Create anchor element for the job ling
            var jobLinkElement = document.createElement('a');
            jobLinkElement.href = currentJob.jobLink;


            // Create h3 element for job title
            var jobTitleElement = document.createElement('h3');
            jobTitleElement.textContent = currentJob.jobTitle;
  
            // Append the job link element to the jobTitleElement
            jobLinkElement.appendChild(jobTitleElement);

            // Append the jobLinkElement to the jobOutput div
            currentJobOutputDiv.appendChild(jobLinkElement);

            // Same for the rest
            var companyElement = document.createElement('p');
            companyElement.textContent = 'Company: ' + currentJob.company;
            currentJobOutputDiv.appendChild(companyElement);

            var dateCreatedElement = document.createElement('p');
            dateCreatedElement.textContent = 'Date Created: ' + currentJob.dateCreated;
            currentJobOutputDiv.appendChild(dateCreatedElement);

            var jobDescriptionElement = document.createElement('p');
            jobDescriptionElement.textContent = currentJob.jobDescription;
            currentJobOutputDiv.appendChild(jobDescriptionElement);

            var deleteBtnElement = document.createElement('button');
            deleteBtnElement.textContent = "Delete";
            deleteBtnElement.setAttribute('id', 'delete-btn' + i);
            deleteBtnElement.setAttribute('class', 'ui secondary button wide');
            deleteBtnElement.setAttribute('onclick', 'handleDeleteFromLocal(event)')
            currentJobOutputDiv.appendChild(deleteBtnElement);
        }
    // If no saved jobs, logs no saved jobs.
    } else {
        console.log("No saved jobs!");
    }
}

// Function to delete the saved job listing when the user clicks the delete btn.
function handleDeleteFromLocal(event) {
    // Creating vars based on which job the user chose to delete.
    var deleteElement = event.target.parentElement;
    console.log(event.target.parentElement);
    // gets the id of the div where the click event originated.
    var elName = deleteElement.id;
    localStorage.removeItem(elName)
    savedNum--;
    localStorage.setItem("savedNum", JSON.stringify(savedNum));
    deleteElement.remove()
    if(savedNum == 0) {
        jobOutput.textContent = "No saved headlines!";
    }
}

displayStoredJob();


