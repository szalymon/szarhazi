"use strict";
var shapefile_1 = require("../common/shapefile");
var fs = require('fs');
var Cv4sParser = (function () {
    function Cv4sParser() {
    }
    Cv4sParser.parseFile = function (file) {
        var world = new shapefile_1.shapefile.World();
        return null;
    };
    return Cv4sParser;
}());
function process(data) {
    var world = new shapefile_1.shapefile.World();
    for (var _i = 0, _a = data.entities; _i < _a.length; _i++) {
        var entity = _a[_i];
        if (entity.__type == 'Polygon:Core.Model') {
            var polygon = new shapefile_1.shapefile.Polygon();
            var record = new shapefile_1.shapefile.Record();
            record.shape = polygon;
            world.records.push(record);
            for (var _b = 0, _c = entity.points; _b < _c.length; _b++) {
                var point = _c[_b];
                polygon.points.push(new shapefile_1.shapefile.Point(point._x, point._y));
            }
        }
    }
    setWorld(world);
}
var world;
function setWorld(_world) {
    world = _world;
    console.log("Server has been initialized!");
}
function start() {
    console.log("Called");
    fs.readFile('example/minta.cv4s', 'utf8', function (err, content) {
        process(JSON.parse(content));
    });
}
exports.start = start;
;
start();
function getWorld() {
    return world;
}
exports.getWorld = getWorld;
