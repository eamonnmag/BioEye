var compass_watchID = null;
var compass_controller = new SensorController(0.8, true);

// Start watching the compass
//
function compass_startWatch() {

    // Update compass every X seconds
    var options = { frequency:250 };

    compass_watchID = navigator.compass.watchHeading(compass_onSuccess, compass_onError, options);
}

// Stop watching the compass
//
function compass_stopWatch() {
    if (compass_watchID) {
        navigator.compass.clearWatch(compass_watchID);
        compass_watchID = null;
    }
}

// onSuccess: Get the current heading
//
function compass_onSuccess(heading) {
    //var element = document.getElementById('heading');
    //element.innerHTML = 'Heading: ' + heading;
    var value = heading + 90;
    if (value > 360)
        value -= 360;
    main_azimuth = compass_controller.getValue(value);
    drawingStage();
}

// onError: Failed to get the heading
//
function compass_onError() {
    alert('Compass: onError!');
}
