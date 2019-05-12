// Initialize app
var myApp = new Framework7();

// global variables to get the City, Country, and global exchange Ratio
var exchangeratioUSDEUR;
var cityglobal;
var countryglobal;
var latitudeglobal;
var longitudeglobal;

// we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
// I trigger Location, Temperature, draw the map and try to record a file
$$(document).on('deviceready', function() {
    getcurrency();
    openCage();
    getweather();
    myFunction();
    console.log("Device is ready!");
    getLocation();
    tryingFile();
    fileSystemCallback(fs);
    getFileCallback(fileEntry);
    readFile(fileEntry);

});

    // this function will trigger every second and will update the weather AND the excange ratio every 5 seconds
function myFunction() {
    setInterval(function(){ 
        getweather();
        }, 5000);
    }

// onError callback
function onError(msg){
    console.log(msg);
}

// JSON object
var options = {
    frequency: 3000
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

// The map originaly will start with the current location of CCT college
//This value will be override by the current location

var cct2 = {lat: 53.346, lng: -6.2588};

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
    var location = "lat: " + lat + ", lng: " + lon;

    // Placing the data on the front end
    document.getElementById('position').innerHTML = location;
    cct2 = {lat: lat, lng: lon};
    initMap();
}

// This is the callback function for the google maps API
function initMap() {

    // Defining a position to display
    //var cct2 = {lat: 53.346, lng: -6.2588};
    
    // Creating the map, centred on the position 
    // defined above
    var myMap = new google.maps.Map(document.getElementById('map'),
        {zoom: 17,
        center: cct2 });

    console.log(myMap);
    
    // Creating a marker to place on the map
    // the college CCT
    var marker = new google.maps.Marker(
        { position: cct2,
        map: myMap });
    
    // Adding another pointer
    //var otherLocation = {lat: 53.3458, lng: -6.2575};
    //var marker2 = new google.maps.Marker(
    //    { position: otherLocation,
    //   map: myMap });

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
        cityglobal = city;
        countryglobal = country;


        // Formattng data to put it on the front end
        var oc = "City: " + city + "<br>Country: " + country + "<br>Currency: " + currency;

        // Placing formatted data on the front ed
        document.getElementById('opencage').innerHTML = oc;
    }
}


function getweather(){

    // The XMLHttpRequest object, is the one in 
    // charge of handleing the request for us
    var http = new XMLHttpRequest();

    // The url to send the request to. Notice that we're passing
    // here some value of Latituted and longitude for the API 
    // to process
    const url = "http://api.openweathermap.org/data/2.5/weather?q="+ cityglobal +","+ countryglobal +"&units=metric&APPID=52587be1d1dde7242650c7aec326be61";
    console.log(url);
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
        console.log(responseJSON.name);
        console.log(responseJSON.sys.country);
        console.log(responseJSON.main.temp);

        // Extracting the individual values, just as we
        // do with any JSON object. Just as we did 
        // with the position.
        // REMEMBER: In this case, we have an array inside 
        // the JSON object.
        var temp = responseJSON.main.temp;
        var templayout = "Temperature: " + temp +"°C";


        // Placing formatted data on the front end
        document.getElementById('temp').innerHTML = templayout;
    }
    
}
 

// Fuction to get currency value and conversion

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


//All this functions are meant to record the previous location in the persistent storage so we could load the previous data
//I was not able to complete on time to finish the project but is very close to be completed.


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
