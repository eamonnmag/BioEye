var ResourceDrawer = function (latitude, longitude, altitude, icon_source, name) {
    this.resource_location = [latitude, longitude, altitude];
    this.name = name;

    // Point for compass
    this.point = [-100, -100];

    var drawable_ready = false;
    var icon = new Image();
    icon.onload = function () {
        drawable_ready = true;
    };
    icon.src = icon_source;

    // Screen point
    this.position = [-100, -100];

    this.draw = function (user_location, user_azimuth, user_roll) {
        if (!drawable_ready)
            return;

        var distance = calculateDistance(user_location, this.resource_location);
        var res_azimuth = calculateResourceAzimuth(user_location, this.resource_location);

        this.point = [distanceLog(distance) * 100 * Math.sin(res_azimuth * Math.PI / 180),
            distanceLog(distance) * -100 * Math.cos(res_azimuth * Math.PI / 180)];

        var azimuth = calculateAzimuthFromUser(user_azimuth, res_azimuth);

        var res_roll = 90;
        if (user_location[2] && this.resource_location[2])
            res_roll = calculateRoll(distance, this.resource_location[2], user_location[2]);
        var elevation = calculateRollFromUser(user_roll, res_roll);

        if ((Math.abs(azimuth) > MAX_AZIMUTH_VISIBLE) || (Math.abs(elevation) > MAX_ELEVATION_VISIBLE)) {
            this.position = [-100, -100];
            return;
        }

        this.position = [canvas.width / 2, canvas.height / 2]; // [x_pixel, y_pixel]

        /* Calculating the screen pixel that corresponds to the node */
        this.position[0] = this.position[0] + (Math.sin(Math.PI * azimuth / 180) / Math.sin(Math.PI * MAX_AZIMUTH_VISIBLE / 180)) * this.position[0];
        this.position[1] = this.position[1] + (Math.sin(Math.PI * elevation / 180) / Math.sin(Math.PI * MAX_ELEVATION_VISIBLE / 180)) * this.position[1];

        canvas_ctx.save();

        // Painting icon
        roundedRect(canvas_ctx, this.position[0] - ICON_SIZE / 2 - 5, this.position[1] - ICON_SIZE / 2 - 5, ICON_SIZE + 10, ICON_SIZE + 10, 5);
        canvas_ctx.drawImage(icon, this.position[0] - ICON_SIZE / 2, this.position[1] - ICON_SIZE / 2, ICON_SIZE, ICON_SIZE);

        // painting name
        canvas_ctx.font = '14px Arial';

        var len = canvas_ctx.measureText(this.name).width;
        if (len > 2 * ICON_SIZE) {
            this.name = this.name.substring(0, 13);
            len = canvas_ctx.measureText(this.name).width;
        }

        roundedRect(canvas_ctx, this.position[0] - len / 2 - 5, this.position[1] + ICON_SIZE / 2 + 5, len + 10, 24, 5);

        canvas_ctx.textAlign = 'center';
        canvas_ctx.fillStyle = '#FFF';
        canvas_ctx.fillText(this.name, this.position[0], this.position[1] + ICON_SIZE / 2 + 5 + 16.5, len);
        canvas_ctx.restore();
    }
}
    