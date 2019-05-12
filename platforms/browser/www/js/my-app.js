// Initialize app
var myApp = new Framework7();

// global variable to get the current ratio and use in geteuros or getDollars function
var exchangeratioUSDEUR;

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    getcurrency();
    openCage();
    console.log("Device is ready!");
    tryingFile();
    fileSystemCallback(fs);
    getFileCallback(fileEntry);
    readFile(fileEntry);

});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('about', function (page) {
    // Do something here for "about" page

})

// Option 2. Using one 'pageInit' event handler for all pages:
$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;

    if (page.name === 'about') {
        // Following code will be executed for page with data-page attribute equal to "about"
        myApp.alert('Here comes About page');
    }
})

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    myApp.alert('Here comes About page');
})


function getcurrency(){

    // The XMLHttpRequest object, is the one in 
    // charge of handleing the request for us
    var http = new XMLHttpRequest();

    // The url to send the request to. Notice that we're passing
    // here some value of Latituted and longitude for the API 
    // to process
    const url = 'http://www.apilayer.net/api/live?access_key=08d50c3c6eff34145f7d641e6178d265';

    // Opening the request. Remember, we will send
    // a "GET" request to the URL define above
    http.open("GET", url);
    // Sending the request
    http.send();

    // Once the request has been processed and we have
    // and answer, we can do something with it
    http.onreadystatechange = (e) => {
        
        // First, I'm extracting the reponse from the 
        // http object in text format
        var response = http.responseText;

        // As we know that answer is a JSON object,
        // we can parse it and handle it as such
        var responseJSON = JSON.parse(response); 
    
        // Printing the result JSON to the console
        console.log(responseJSON);

        // Extracting the individual values, just as we
        // do with any JSON object. Just as we did 
        // with the position.
        // REMEMBER: In this case, we have an array inside 
        // the JSON object.
        var usd = responseJSON.quotes.USDEUR;

        // Formattng data to put it on the front end
        var oc = usd;
        exchangeratioUSDEUR = responseJSON.quotes.USDEUR;

        // Placing formatted data on the front end
        document.getElementById('currency').innerHTML = oc;
        console.log(oc);
    }
    
}

function converttodollars()
{
  //Getting the value of the total of euros sent by the end user
    var numberone = document.getElementById('euros').value;

    // calculating the value in dollars with the currentExcange ratio
    var convertdollars = numberone / exchangeratioUSDEUR;

    console.log(numberone);
    console.log(exchangeratioUSDEUR);
    console.log(convertdollars);

    //Sending the calculated data to front end
    document.getElementById('convertdollars').innerHTML = convertdollars;
}

function converttoeuros()
{
  //Getting the value of the total of dollars sent by the end user
    var numberone = document.getElementById('dollars').value;
// calculating the value in euros with the currentExcange ratio
    var converteuros = numberone * exchangeratioUSDEUR;

    console.log(numberone);
    console.log(exchangeratioUSDEUR);
    console.log(converteuros);
//Sending the calculated data to front end
    document.getElementById('converteuros').innerHTML = converteuros;
}


function tryingFile(){

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemCallback, onError);
   
}

function fileSystemCallback(fs){

    // Name of the file I want to create
    var fileToCreate = "newPersistentFile.txt";

    // Opening/creating the file
    fs.root.getFile(fileToCreate, fileSystemOptionals, getFileCallback, onError);
}

var fileSystemOptionals = { create: true, exclusive: false };

function getFileCallback(fileEntry){
    
    var dataObj = new Blob(['Hello'], { type: 'text/plain' });
    // Now decide what to do
    // Write to the file
    writeFile(fileEntry, dataObj);

    // Or read the file
    readFile(fileEntry);
}

// Let's write some files
function writeFile(fileEntry, dataObj) {

    // Create a FileWriter object for our FileEntry (log.txt).
    fileEntry.createWriter(function (fileWriter) {

        // If data object is not passed in,
        // create a new Blob instead.
        if (!dataObj) {
            dataObj = new Blob(['Hello'], { type: 'text/plain' });
        }

        fileWriter.write(dataObj);

        fileWriter.onwriteend = function() {
            console.log("Successful file write...");
        };

        fileWriter.onerror = function (e) {
            console.log("Failed file write: " + e.toString());
        };

    });
}

// Let's read some files
function readFile(fileEntry) {

    // Get the file from the file entry
    fileEntry.file(function (file) {
        
        // Create the reader
        var reader = new FileReader();
        reader.readAsText(file);

        reader.onloadend = function() {

            console.log("Successful file read: " + this.result);
            console.log("file path: " + fileEntry.fullPath);

        };

    }, onError);
}

function onError(msg){
    console.log(msg);
}

function shake(){
    navigator.vibrate(1000);
}


// onError callback
function onError(msg){
    console.log(msg);
}

// JSON object
var options = {
    frequency: 3000
}

// THIS IS THE FUNCTION THAT WILL READ THE ACCELEROMETER
var watchID = null;
function startWatch(){

    // Notice that the function takes two callbacks (accCallback and onError) and
    // a JSON object (options)
    watchID = navigator.accelerometer.watchAcceleration(accCallback, onError, options); 

}

// This function is going to use the plugin to 
// get the latitude and longitud from the device
function getLocation(){
    // Once the position has been retrieved, an JSON object
    // will be passed into the callback function (in this case geoCallback)
    // If something goes wrong, the onError function is the 
    // one that will be run
    navigator.geolocation.getCurrentPosition(geoCallback, onError);
}

var latitudeglobal;
var longitudeglobal;

// The callback function must catch the object with the position
function geoCallback(position){

    // Printing the position object to the console
    console.log(position);

    // Extracting the latitude and longitude
    // from the position object
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    
    latitudeglobal =lat;
    longitudeglobal = lon;

    // Formatting the data to put it on the front end
    var location = "Lat: " + lat + "<br>Long: " + lon;

    // Placing the data on the front end
    document.getElementById('position').innerHTML = location;
}

// This is the callback function for the google maps API
function initMap() {

    // Defining a position to display
    var cct = {lat: 53.346, lng: -6.2588};
    
    // Creating the map, centred on the position 
    // defined above
    var myMap = new google.maps.Map(document.getElementById('map'),
        {zoom: 16,
        center: cct });

    console.log(myMap);
    
    // Creating a marker to place on the map
    // at the position defined above
    var marker = new google.maps.Marker(
        { position: cct,
        map: myMap });
    
    // Adding another pointer
    var otherLocation = {lat: 53.3458, lng: -6.2575};
    var marker2 = new google.maps.Marker(
        { position: otherLocation,
        map: myMap });

    // REMEMBER: I added some style to the style file
    // to be able to display the map!!!
         
} 

// This function is going to be in charge of invoking
// the open cage external API
function openCage(){

    // The XMLHttpRequest object, is the one in 
    // charge of handleing the request for us
    var http = new XMLHttpRequest();

    // The url to send the request to. Notice that we're passing
    // here some value of Latituted and longitude for the API 
    // to process
    const url = 'https://api.opencagedata.com/geocode/v1/json?q=53.34592+-6.25881&key=22e5695431c543d682e4d4b52ec743ab';
    // Opening the request. Remember, we will send
    // a "GET" request to the URL define above
    http.open("GET", url);
    // Sending the request
    http.send();

    // Once the request has been processed and we have
    // and answer, we can do something with it
    http.onreadystatechange = (e) => {
        
        // First, I'm extracting the reponse from the 
        // http object in text format
        var response = http.responseText;

        // As we know that answer is a JSON object,
        // we can parse it and handle it as such
        var responseJSON = JSON.parse(response); 
    
        // Printing the result JSON to the console
        console.log(responseJSON);

        // Extracting the individual values, just as we
        // do with any JSON object. Just as we did 
        // with the position.
        // REMEMBER: In this case, we have an array inside 
        // the JSON object.
        var city = responseJSON.results[0].components.city;
        var country = responseJSON.results[0].components.country;
        var currency = responseJSON.results[0].annotations.currency.name;

        // Formattng data to put it on the front end
        var oc = "City: " + city + "<br>Country: " + country + "<br>Currency: " + currency;

        // Placing formatted data on the front ed
        document.getElementById('opencage').innerHTML = oc;
    }
}
