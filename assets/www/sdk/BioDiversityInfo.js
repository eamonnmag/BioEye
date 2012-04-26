/**
 * Created by Eamonn Maguire.
 */
var BioDiversityInfo = function (id, layer_type, name, description, latitude, longitude, altitude, species) {
    GeoNode.prototype.constructor.call(this, id, latitude, longitude, altitude);

    this.name = name;
    this.layer_type = layer_type;
    this.description = description;
    this.species = species;

    this.imageURL = "images/user.png";
}

BioDiversityInfo.prototype = new GeoNode();