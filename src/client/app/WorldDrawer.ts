import * as Paper from 'paper';
import { shapefile } from './shapefile';

export class WorldDrawer {

    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    public static drawWorld(world: shapefile.World) {
        world.records.forEach(record => {
            if (record.shape.type === shapefile.SHP.POINT) {

                var point = <shapefile.Point>record.shape;
                new Paper.Point(point.x, point.y);

            } else if (record.shape.type === shapefile.SHP.POLYGON) {
                var polygon = <shapefile.Polygon>record.shape;
                var newPath = new Paper.Path();
                newPath.fillColor = "#AAFFAA";
                newPath.style.strokeColor = "#000000";
                newPath.style.strokeWidth = 0.01;
                newPath.onClick = (e:any) => {
                    console.log(e);
                    if(e.event.button != 2) {
                        newPath.selected = !newPath.selected;
                    }
                };

                for (var i = 0; i < polygon.points.length; ++i) {
                    var point = polygon.points[i];
                    newPath.add(new Paper.Point(point.x, point.y));
                }
                newPath.closePath(false);
            }

        });
    }
}