const MAX_LOG_DISTANCE_SHOWN = 3.5;

const AUTO = 0;
const KILOMETERS = 1;
const METERS = 2;

/**
 * Earth's equatorial radius
 */
    const a = 6378137;

/**
 * Earth's polar radius
 */
    const b = 6356752.3;

/**
 * The equivalent in meters for a distance of one latitude second
 */
    const LATITUDE_DEGREE = 30.82;

const absolute_height = 1.75;

/**
 * Calculate the distance (in meters) between two points
 *
 * @param Source (Latitude, Longitude) Point
 * @param Destination (Latitude, Longitude) Location Point
 *
 * @return The distance in meters.
 */

function calculateDistance(pointSource, pointDest) {
    var lat_degree = LATITUDE_DEGREE * 3600;
    var long_degree = ((Math.PI / 180) * Math.cos(Math.PI * (pointSource[0]) / 180) *
        Math.sqrt((Math.pow(a, 4) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
            Math.pow(b, 4) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2)) /
            (Math.pow(a, 2) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
                Math.pow(b, 2) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2))
        ));

    var dist = Math.sqrt(Math.pow((pointDest[0] - pointSource[0]) * lat_degree, 2) + Math.pow((pointDest[1] - pointSource[1]) * long_degree, 2));

    return dist;
}


/**
 * Calculate the distance (in meters) between two Location points
 *
 * @param The distance in meters
 * @param The kind of conversion (AUTO,KILOMETERS,METERS)
 *
 * @return The String with the information of distance
 */

function displayDistance(dist, unit) {

    var distString = null;

    switch (unit) {
        case AUTO:

            if (dist >= 1000.0)
                distString = distanceToKilometers(dist);
            else
                distString = distanceToMeters(dist);

            break;
        case KILOMETERS:

            distString = distanceToKilometers(dist);
            break;

        case METERS:

            distString = distanceToMeters(dist);
            break;

    }

    return distString;


}

function distanceToKilometers(dist) {
    var dist_2 = dist / 1000;

    return dist_2.toFixed(2) + " km.";
}

function distanceToMeters(dist) {
    return dist.toFixed(2) + " m.";
}

function distanceLog(dist) {
    var log = 1.0;

    if (dist == 0)
        return 0;
    log = Math.max(1.0, Math.min(MAX_LOG_DISTANCE_SHOWN, Math.log(dist) / Math.LN10)) / MAX_LOG_DISTANCE_SHOWN;
    return log;
}

/**
 * This function estimates the roll the user has to use in order to see the resource
 * @param distance is the distance to the resource
 * @param ob_height is the height of the object
 * @param user_altitude is the current altitude of the user's geographic point
 * @return This returns the roll in degrees
 */
function calculateRoll(distance, ob_height, user_altitude) {

    var h = (absolute_height + user_altitude) - ob_height;

    var roll = 180 * Math.atan2(distance, h) / Math.PI;

    return roll;
}

/**
 * This function calculates the azimuth between an user and a resource
 * @param user_roll is the
 * @param res_roll
 * @return
 */
function calculateRollFromUser(user_roll, res_roll) {
    return user_roll - res_roll;
}

/**
 * This function calculates the estimated height of a resource from the floor
 * @param roll is the angle that the user and the Z axe defines
 * @param distance is the distance between the user and the resource
 * @return This returns the estimated height of the resource
 */
function calculateResourceHeight(roll, distance) {

    var h_relative = distance / Math.tan(Math.PI * roll / 180);

    return Math.max(0, absolute_height - h_relative);
}

/**
 * This function calculates the azimuth of a resource from the user's position
 * @param source is the user's (latitude, longitude)
 * @param resource is the resource's (latitude, longitude)
 *
 * @return This returns the azimuth in degrees
 */
function calculateResourceAzimuth(pointSource, pointDest) {
    var azimuth;
    var dist_lat;
    var dist_lng;

    var lat_degree = LATITUDE_DEGREE * 3600;
    var long_degree = ((Math.PI / 180) * Math.cos(Math.PI * (pointSource[0]) / 180) *
        Math.sqrt((Math.pow(a, 4) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
            Math.pow(b, 4) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2)) /
            (Math.pow(a, 2) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
                Math.pow(b, 2) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2))
        ));

    dist_lat = (pointDest[0] - pointSource[0]) * lat_degree;
    dist_lng = (pointDest[1] - pointSource[1]) * long_degree;

    azimuth = 180 * Math.atan2(dist_lng, dist_lat) / Math.PI;

    if (azimuth < 0)
        azimuth += 360;

    return azimuth;
}

/**
 * This function calculates the relative azimuth of the resource from the user
 * @param user_azimuth is the azimuth of the user
 * @param resource_azimuth is the azimuth of the resource
 * @return The returned value is the angle in degrees
 */
function calculateAzimuthFromUser(user_azimuth, resource_azimuth) {
    var azimuth = 500;
    var azimuth_Aux;

    if (Math.abs(azimuth_Aux = resource_azimuth - user_azimuth) < Math.abs(azimuth))
        azimuth = azimuth_Aux;

    if (Math.abs(azimuth_Aux = (resource_azimuth - 360) - user_azimuth) < Math.abs(azimuth))
        azimuth = azimuth_Aux;

    if (Math.abs(azimuth_Aux = (360 + resource_azimuth) - user_azimuth) < Math.abs(azimuth))
        azimuth = azimuth_Aux;


    return azimuth;
}

/**
 * This function calculates the position of the resource you want to fix.
 *     @param p0 Contains the (latitude, longitude) tuple of the first point
 *     @param p1 Contains the (latitude, longitude) tuple of the second point
 *     @param or0 This is the angle of the first point that the orientation sensor give us
 *     @param or1 This is the angle of the second point that the orientation sensor give us
 *
 *     @return Returns the (latitude, longitude) tuple of the resource point
 */
function calculateIntersection(pointSource, pointDest, or0, or1) {

    var lat_degree = LATITUDE_DEGREE * 3600;
    var long_degree = ((Math.PI / 180) * Math.cos(Math.PI * (pointSource[0]) / 180) *
        Math.sqrt((Math.pow(a, 4) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
            Math.pow(b, 4) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2)) /
            (Math.pow(a, 2) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
                Math.pow(b, 2) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2))
        ));

    var m0 = Math.tan(Math.PI * (90 - or0) / 180);
    var m1 = Math.tan(Math.PI * (90 - or1) / 180);

    //Cartesian system
    var p0 = [0, 0];
    var p1 = [ long_degree * (pointDest[1] - pointSource[1]),
        lat_degree * (pointDest[0] - pointSource[0]) ];


    var p_res = new Array(2);
    p_res[1] = (m0 * p0[0] - m1 * p1[0] + p1[1] - p0[1]) / (m0 - m1);
    p_res[0] = (m0 * (p_res[1] - p0[0]) + p0[1]) / lat_degree + pointSource[0];

    p_res[1] = p_res[1] / long_degree + pointSource[1];

    return p_res;
}

function calculateIntersection(p0, or0, distance) {
    return distance2Coord(p0, or0, distance);
}

function calculateIntersectionElevation(pointSource, pointDest, or, el0, el1) {

    var lat_degree = LATITUDE_DEGREE * 3600;
    var long_degree = ((Math.PI / 180) * Math.cos(Math.PI * (pointSource[0]) / 180) *
        Math.sqrt((Math.pow(a, 4) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
            Math.pow(b, 4) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2)) /
            (Math.pow(a, 2) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
                Math.pow(b, 2) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2))
        ));

    var m0 = Math.tan(Math.PI * (el0 - 90) / 180);
    var m1 = Math.tan(Math.PI * (el1 - 90) / 180);

    var y = lat_degree * (pointDest[0] - pointSource[0]);
    var x = long_degree * (pointDest[1] - pointSource[1]);

    var distance = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    var difference = 180 * (Math.atan2(y, x)) / Math.PI;
    if (difference > 90)
        difference -= 360;

    if (( Math.abs(difference - (90 - or)) > 90 ) &&
        ( Math.abs(difference - (90 - or)) < 270 )) {
        distance = -distance;
    }

    //Cartesian system
    var p0 = [0, 0];
    var p1 = [ distance, 0 ];

    distance = (m0 * p0[0] - m1 * p1[0] + p1[1] - p0[1]) / (m0 - m1);

    p_res = distance2Coord(pointSource, or, distance);

    return p_res;
}

/**
 * This function estimates, given a distance, where is the resource. It suppose that the user is directly pointing to it.
 * @param p0 is the point where the user is
 * @param or is the azimuth of the user
 * @param d is the distance to the resource
 *
 * @return the coordinates of the resource
 */
function distance2Coord(pointSource, or, d) {

    var lat_degree = LATITUDE_DEGREE * 3600;
    var long_degree = ((Math.PI / 180) * Math.cos(Math.PI * (pointSource[0]) / 180) *
        Math.sqrt((Math.pow(a, 4) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
            Math.pow(b, 4) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2)) /
            (Math.pow(a, 2) * Math.pow(Math.cos(Math.PI * (pointSource[0]) / 180), 2) +
                Math.pow(b, 2) * Math.pow(Math.sin(Math.PI * (pointSource[0]) / 180), 2))
        ));

    var lat = d * Math.cos(Math.PI * or / 180) / lat_degree;
    var lng = d * Math.sin(Math.PI * or / 180) / long_degree;

    var res = [lat + pointSource[0], lng + pointSource[1]];

    return res;
}

function moveTo(loc, orientation, rotation, distance) {

    var coords = calculateIntersection(loc, turnAngle(orientation, rotation), distance);

    return coords;

}

function turnAngle(orientation, angle) {
    var new_angle;

    new_angle = orientation + angle;
    if (new_angle >= 360)
        new_angle -= 360;

    if (new_angle < 0)
        new_angle += 360;

    return new_angle;
}

function turnPoint(point, angle) {
    var p_res = [0.0, 0.0];

    p_res[0] = point[0] * Math.cos(Math.PI * (angle) / 180) + point[1] * Math.sin(Math.PI * (angle) / 180);
    p_res[1] = point[1] * Math.cos(Math.PI * (angle) / 180) - point[0] * Math.sin(Math.PI * (angle) / 180);

    return p_res;
}