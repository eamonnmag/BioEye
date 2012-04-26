var CompassDrawer = function () {

    var mRADIUS = 0;
    var mRADIUSANGLE = 0;
    var maxRadiusResource = 0;

    var drawable_ready1 = false;
    var drawable_ready2 = false;

    var shadow_image = new Image();
    shadow_image.onload = function () {
        drawable_ready1 = true;
    };
    shadow_image.src = "images/compass_simple_shadow.png";

    var main_image = new Image();
    main_image.onload = function () {
        drawable_ready2 = true;
        mRADIUS = main_image.width / 2;
        mRADIUSANGLE = mRADIUS - transformPixInDip(4);
        maxRadiusResource = mRADIUSANGLE - transformPixInDip(2);
    };
    main_image.src = "images/compass_simple.png";

    this.draw = function (azimuth) {
        if (!drawable_ready1 || !drawable_ready2 || !azimuth)
            return;

        canvas_ctx.save();
        // Paiting the vision range
        canvas_ctx.fillStyle = "#27AAE1";
        canvas_ctx.beginPath();
        canvas_ctx.arc(10 + main_image.width / 2, 10 + main_image.height / 2, mRADIUSANGLE, (-MAX_AZIMUTH_VISIBLE - 90) * Math.PI / 180, (MAX_AZIMUTH_VISIBLE - 90) * Math.PI / 180, false);
        canvas_ctx.fill();
        canvas_ctx.beginPath();
        canvas_ctx.moveTo(10 + main_image.width / 2, 10 + main_image.height / 2);
        canvas_ctx.lineTo(10 + main_image.width / 2 - (mRADIUSANGLE * Math.sin(MAX_AZIMUTH_VISIBLE * Math.PI / 180)),
            10 + main_image.height / 2 - (mRADIUSANGLE * Math.cos(MAX_AZIMUTH_VISIBLE * Math.PI / 180)));
        canvas_ctx.lineTo(10 + main_image.width / 2 + (mRADIUSANGLE * Math.sin(MAX_AZIMUTH_VISIBLE * Math.PI / 180)),
            10 + main_image.height / 2 - (mRADIUSANGLE * Math.cos(MAX_AZIMUTH_VISIBLE * Math.PI / 180)));
        canvas_ctx.fill();

        // Painting the shadow
        canvas_ctx.drawImage(shadow_image, 10, 10);

        canvas_ctx.save();
        //Painting the rotating compass
        canvas_ctx.translate(10 + main_image.width / 2, 10 + main_image.height / 2);
        canvas_ctx.rotate(-azimuth * Math.PI / 180);
        canvas_ctx.drawImage(main_image, -main_image.width / 2, -main_image.height / 2);

        //Painting the resource points
        if (nodes_list) {
            var max_nodes = nodes_list.length;
            var i = 0;
            canvas_ctx.fillStyle = "#F15A29";
            for (i = 0; i < max_nodes; i++) {
                canvas_ctx.beginPath();
                canvas_ctx.arc(maxRadiusResource * nodes_list[i].resourceDrawer.point[0] / 100,
                    maxRadiusResource * nodes_list[i].resourceDrawer.point[1] / 100,
                    2, 0, 2 * Math.PI, false);
                canvas_ctx.fill();
            }
        }
        canvas_ctx.restore();

        canvas_ctx.restore();
    }
}