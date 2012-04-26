function toggleVisibility(element) {
    var div = document.getElementById(element);
    var vis = div.style;
    if (vis.display == '' && div.offsetWidth != undefined && div.offsetHeight != undefined)
        vis.display = (div.offsetWidth != 0 && div.offsetHeight != 0) ? 'block' : 'none';
    vis.display = (vis.display == '' || vis.display == 'block') ? 'none' : 'block';
}

function hideElement(element_id) {
    var div = document.getElementById(element_id);
    var vis = div.style;
    vis.display = 'none';
}

function showElement(element_id) {
    var div = document.getElementById(element_id);
    var vis = div.style;
    vis.display = 'block';
}

function isPointInCircularArea(center, radius, target) {
    return Math.sqrt(Math.pow(target[0] - center[0], 2) + Math.pow(target[1] - center[1], 2)) < radius
}

function transformPixInDip(pix) {
    return ((pix * window.devicePixelRatio) + 0.5);
}