var Photo = function (id, latitude, longitude, altitude, radius, name, description, url, since, uploader, position_since, external_info) {
    GeoNode.prototype.constructor.call(this, id, latitude, longitude, altitude, radius, since, position_since, external_info);

    this.name = name;
    this.description = description;
    this.imageURL = url;
    this.uploader = uploader;

    this.imagePath = "";

    if (!url)
        if (external_info)
            this.imageURL = external_info.photo_thumb_url;
        else
            this.imageURL = "images/camera.png";

    this.resourceDrawer = new ResourceDrawer(latitude, longitude, altitude, this.imageURL, name);
}

Photo.prototype = new GeoNode();