var GenericLayer = function (id, layer_type, name, description, since, latitude, longitude, altitude, radius, since_position) {
    GeoNode.prototype.constructor.call(this, id, latitude, longitude, altitude, radius, since, since_position);

    this.name = name;
    this.layer_type = layer_type;
    this.description = description;
    this.categories = [];
    this.arrayNodes = [];
    this.isWriteable = false;
    this.isFree = true;
    this.pattern = "";
    this.page = 1;

    this.resetPagination = function () {
        this.page = 1;
    };
    this.nextPage = function () {
        this.page++;
    };
    this.previousPage = function () {
        if (this.page > 1)
            this.page--;
    };
};

GenericLayer.prototype = new GeoNode();