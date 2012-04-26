var location_watchID = null;

// Start watching location
function location_startWatch() {

    // Update location every 2 minutes
    var options = { frequency:120000, enableHighAccuracy:true };
    location_watchID = navigator.geolocation.watchPosition(location_onSuccess, location_onError, options);
}

// Stop watching the compass
function location_stopWatch() {
    if (location_watchID) {
        navigator.geolocation.clearWatch(location_watchID);
        location_watchID = null;
    }
}

// onSuccess: Get the current location
//
function location_onSuccess(position) {
    main_location = [position.coords.latitude, position.coords.longitude, position.coords.altitude];
    gps_flag.setStatus(true);
    if (!nodes_list)
        getLayersList();
}

// onError: Failed to get the location
//
function location_onError() {
    gps_flag.setStatus(false);
    //alert('location onError!');
}
