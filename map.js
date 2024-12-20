//set map options
var mapOptions = {
    zoom: 10,
    mapTypeId: google.maps.MapTypeId.ROADMAP
};

//create autocomplete objects
var input1 = document.getElementById("departure");
var input2 = document.getElementById("destination");
//var input3 = document.getElementById("departure2");
//var input4 = document.getElementById("destination2");
var options = {
    types: ['(cities)']   
}
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);
//var autocomplete3 = new google.maps.places.Autocomplete(input3, options);
//var autocomplete4 = new google.maps.places.Autocomplete(input4, options);

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();
var directionsDisplay; // Declare directionsDisplay variable

//onload:
google.maps.event.addDomListener(window, 'load', initialize);

//initialize: draw map in the #googleMap div
function initialize() {
    //create a DirectionsRenderer object which we will use to display the route
    directionsDisplay = new google.maps.DirectionsRenderer();
    //create map
    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);
    //bind the DirectionsRenderer to the map
    directionsDisplay.setMap(map);

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        }, function() {
            handleLocationError(true, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map.getCenter());
    }
}//end of initialize

function handleLocationError(browserHasGeolocation, pos) {
    var infoWindow = new google.maps.InfoWindow({map: map});
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
}

//Calculate route when selecting autocomplete:
google.maps.event.addListener(autocomplete1, 'place_changed', calcRoute);
google.maps.event.addListener(autocomplete2, 'place_changed', calcRoute);

// Calculate Route:  
function calcRoute() {
    var start = $('#departure').val();
    var end = $('#destination').val();
    var request = {
        origin:start, 
        destination:end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.IMPERIAL,
        durationInTraffic: false,   
        avoidHighways: false,   
        avoidTolls: false,
    };
    if(start && end){
        directionsService.route(request, function(response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            }else{ 
                initialize();
            }
        });
    }
}