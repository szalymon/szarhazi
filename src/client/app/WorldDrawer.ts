import * as Paper from 'paper';
import { shapefile } from './shapefile';

export class WorldDrawer {

    canvas: HTMLCanvasElement;

    static polygonBackgroundColor: string = "#AAFFAA";
    static strokeColor: string = "#FF0000";
    static strokeWidth: number = 0.005;

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
                newPath.fillColor = WorldDrawer.polygonBackgroundColor;
                newPath.style.strokeColor = WorldDrawer.strokeColor;
                newPath.style.strokeWidth = WorldDrawer.strokeWidth;
                
                for (var i = 0; i < polygon.points.length; ++i) {
                    var point = polygon.points[i];
                    newPath.add(new Paper.Point(point.x, point.y));
                }
                newPath.closePath(false);
            }

        });
    }
}