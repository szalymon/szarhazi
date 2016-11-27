import * as Paper from 'paper';
import { shapefile } from './shapefile';



export class CanvasController {

    path: Paper.Path;
    canvas: HTMLCanvasElement;
    paths: Paper.Path[] = [];

    middelButtonDown: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setupCanvas(this.canvas);

        this.path = new Paper.Path();
        this.path.fillColor = "#000000";
        this.path.fullySelected = true;

    }

    protected setupCanvas(canvas: HTMLCanvasElement): void {
        Paper.setup(canvas);
        Paper.view.center = new Paper.Point(0, 0);
        Paper.view.zoom = 1.5;

        $('#zoom-out').click(() => {
            var newValue = Paper.view.zoom - 0.5;
            if (newValue > 0) {
                Paper.view.zoom = newValue;
            }
            console.log(Paper.view.zoom);
        });
        $('#zoom-in').click(() => {
            var newValue = Paper.view.zoom + 0.5;
            Paper.view.zoom = newValue;
        });

        $(canvas).mousedown(e => {
            if (e.button == 1) {
                this.middelButtonDown = true;
            }
        });

        $(canvas).mouseup(e => {
            if (e.button == 1) {
                this.middelButtonDown = false;
            }
        });

        $(canvas).mousemove((e) => {
            if (this.middelButtonDown) {
                var deltX = (<MouseEvent>e.originalEvent).movementX / Paper.view.zoom;
                var deltY = (<MouseEvent>e.originalEvent).movementY / Paper.view.zoom;

                var currentCenter = Paper.view.center;
                var newCenter = new Paper.Point(currentCenter.x - deltX, currentCenter.y - deltY);
                Paper.view.center = newCenter;
            }
        });
    }

    public drawWorld(world: shapefile.World) {
        console.log("Start drawing the world");
        world.records.forEach(record => {
            if (record.shape.type === shapefile.SHP.POINT) {
                console.log("Point");

                var point = <shapefile.Point>record.shape;
                new Paper.Point(point.x, point.y);

            } else if (record.shape.type === shapefile.SHP.POLYGON) {
                console.log(record.shape.toString());

                var polygon = <shapefile.Polygon>record.shape;
                var newPath = new Paper.Path();
                newPath.fillColor = "#AAFFAA";
                newPath.style.strokeColor = "#000000";
                newPath.style.strokeWidth = 0.1;
                newPath.onClick = (e) => {
                    newPath.selected = !newPath.selected;
                };


                for(var i = 0; i < polygon.points.length; ++i) {
                    var point = polygon.points[i];
                    newPath.add(new Paper.Point(point.x, point.y));
                }
                /*
                polygon.points.forEach(point => {
                    newPath.add(new Paper.Point(point.x, point.y));
                });
                */
                this.paths.push(newPath);
                newPath.closePath(false);
            }
        });

        console.log("World has been drawed!");
    }
}
