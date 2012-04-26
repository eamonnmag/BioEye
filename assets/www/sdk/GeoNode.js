var GeoNode = function (id, latitude, longitude, altitude, radius, external_info) {
    this.id = id;
    this.latitude = latitude;
    this.longitude = longitude;
    this.altitude = altitude;

    this.getLocation = function () {
        return [latitude, longitude, altitude];
    };
};
