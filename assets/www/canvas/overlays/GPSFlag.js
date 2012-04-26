var GPSFlag = function () {

    var mBORDER = 10;

    var status = false;

    var drawable_ready_gps_off = false;
    var drawable_ready_gps_on = false;

    var gps_off = new Image();
    gps_off.onload = function () {
        drawable_ready_gps_off = true;
    };
    gps_off.src = "images/gps_off.png";

    var gps_on = new Image();
    gps_on.onload = function () {
        drawable_ready_gps_on = true;
    };
    gps_on.src = "images/gps_on.png";

    this.setStatus = function (new_status) {
        status = new_status;
    }

    this.draw = function () {
        canvas_ctx.save();

        if (status) {
            if (!drawable_ready_gps_on)
                return;
            canvas_ctx.drawImage(gps_on, canvas.width - gps_on.width - mBORDER,
                canvas.height - gps_on.height - mBORDER);
        } else {
            if (!drawable_ready_gps_off)
                return;
            canvas_ctx.drawImage(gps_off, canvas.width - gps_off.width - mBORDER,
                canvas.height - gps_off.height - mBORDER);
        }

        canvas_ctx.restore();
    }
}