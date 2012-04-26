var accel_watchID = null;
var accel_controller = new SensorController(0.5, false);

// Start watching the compass
function accel_startWatch() {

    // Update accel every X ms.
    var options = { frequency:500 };
    accel_watchID = navigator.accelerometer.watchAcceleration(accel_onSuccess, accel_onError, options);
}

// Stop watching the accel
function accel_stopWatch() {
    if (accel_watchID) {
        navigator.accelerometer.clearWatch(accel_watchID);
        accel_watchID = null;
    }
}

// onSuccess: Get the current heading
function accel_onSuccess(accel) {
    var module = Math.sqrt(Math.pow(accel.x, 2) + Math.pow(accel.y, 2) + Math.pow(accel.z, 2));
    main_roll = accel_controller.getValue(180 * (module - accel.z) / (2 * module));
}

// onError: Failed to get the heading
//
function accel_onError() {
    alert('Accelerometer: onError!');
}
