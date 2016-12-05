import { shapefile } from "../common/shapefile";
var fs = require('fs');


class Cv4sParser {

    static parseFile(file:File): shapefile.World {
        var world = new shapefile.World(); 
        return null;
    }

}


function process(data: any) {
    var world = new shapefile.World();
    
    for(var entity of data.entities) {
        if(entity.__type == 'Polygon:Core.Model') {
            var polygon = new shapefile.Polygon();
            var record = new shapefile.Record();
            record.shape = polygon;
            world.records.push(record);

            for(var point of entity.points) {
                polygon.points.push(new shapefile.Point(point._x,point._y));
            }
        }
    }

    setWorld(world);
}

var world: shapefile.World;
function setWorld(_world: shapefile.World) {
    world = _world;
    console.log("Server has been initialized!");
}

export function start() {
    console.log("Called");
    fs.readFile('example/minta.cv4s', 'utf8', function(err, content) {
        process(JSON.parse(content));
    });
};
start();

export function getWorld() : shapefile.World {
    return world;
}