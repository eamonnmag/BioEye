const ICON_SIZE = 48;
const MAX_AZIMUTH_VISIBLE = 30;
const MAX_ELEVATION_VISIBLE = 20;

var canvas_ctx;
var canvas;

var compass;
var gps_flag;

function initCanvas() {
    canvas = document.getElementById('canvas');
    //alert(document.body.clientWidth * window.devicePixelRatio + ' ' + document.body.clientHeight * window.devicePixelRatio);
    canvas.width = document.body.clientWidth * window.devicePixelRatio;
    canvas.height = document.body.clientHeight * window.devicePixelRatio;
    canvas.addEventListener("click", canvas_clickListener, false);

    canvas_ctx = document.getElementById('canvas').getContext("2d");

    compass = new CompassDrawer();
    gps_flag = new GPSFlag();
}

function drawingStage() {
    clearCanvas();
    //drawMeasures();
    gps_flag.draw();
    if (nodes_list) {
        var max_nodes = nodes_list.length;
        var i = 0;
        for (i = 0; i < max_nodes; i++)
            nodes_list[i].resourceDrawer.draw(main_location, main_azimuth, main_roll);
    }
    compass.draw(main_azimuth);
}

function drawMeasures() {
    canvas_ctx.save();

    canvas_ctx.font = '15px Arial';
    canvas_ctx.fillStyle = '#F00';
    if (main_location)
        canvas_ctx.fillText("Position: (" + main_location[0] + "º, " + main_location[1] + "º, " + main_location[2] + "m.)", 10, canvas.height - 45);
    if (main_azimuth)
        canvas_ctx.fillText("Azimuth: " + main_azimuth + "º", 10, canvas.height - 30);
    if (main_roll)
        canvas_ctx.fillText("Elevation: " + main_roll + "º", 10, canvas.height - 15);

    canvas_ctx.restore();
}

function canvas_clickListener(e) {
    //e.clientX, e.clientY
    if (nodes_list) {
        var max_nodes = nodes_list.length;
        var i = 0;
        for (i = max_nodes - 1; i > -1; i--) {
            if (isPointInCircularArea(nodes_list[i].resourceDrawer.position, transformPixInDip(25), [e.clientX, e.clientY])) {
                drawSummaryBox(nodes_list[i]);
                break;
            }
        }
    }
}

function clearCanvas() {
    canvas_ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function roundedRect(ctx, x, y, width, height, radius) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.78)";
    ctx.beginPath();
    ctx.moveTo(x, y + radius);
    ctx.lineTo(x, y + height - radius);
    ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
    ctx.lineTo(x + width - radius, y + height);
    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
    ctx.lineTo(x + width, y + radius);
    ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
    ctx.lineTo(x + radius, y);
    ctx.quadraticCurveTo(x, y, x, y + radius);
    ctx.fill();
    ctx.restore();
}