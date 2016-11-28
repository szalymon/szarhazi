import * as Paper from 'paper';
import { shapefile } from './shapefile';

export class CanvasController {

    path: Paper.Path;
    canvas: HTMLCanvasElement;

    rightMouseButtonDown: boolean;
    leftMouseStillDown: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.rightMouseButtonDown = false;
        this.leftMouseStillDown = false;
        this.setupCanvas(canvas);
    }

    protected setupCanvas(canvas: HTMLCanvasElement): void {
        Paper.setup(canvas);
        Paper.view.center = new Paper.Point(0, 0);
        Paper.view.zoom = 5;
        var zoomConstant = 1.25;
        //$('#mainCanvas').resizable();
        
        $('#zoom-out').click(() => {
            var newValue = Paper.view.zoom * (1 / zoomConstant);
            Paper.view.zoom = newValue;
        });
        $('#zoom-in').click(() => {
            var newValue = Paper.view.zoom * zoomConstant;
            Paper.view.zoom = newValue;
        });

        $(canvas).on('contextmenu', function () { return false; });

        $(canvas).mousedown(e => {
            if (e.button == 2) {
                this.rightMouseButtonDown = true;
                e.stopPropagation();
            }
        });

        $(canvas).mouseup(e => {
            if (e.button == 2) {
                this.rightMouseButtonDown = false;
            }
        });

        $(canvas).mouseleave(e => {
            this.rightMouseButtonDown = false;
        });

        $(canvas).mousemove((e) => {
            if (this.rightMouseButtonDown) {
                var deltX = (<MouseEvent>e.originalEvent).movementX / Paper.view.zoom;
                var deltY = (<MouseEvent>e.originalEvent).movementY / Paper.view.zoom;

                var currentCenter = Paper.view.center;
                var newCenter = new Paper.Point(currentCenter.x - deltX, currentCenter.y - deltY);
                Paper.view.center = newCenter;
            }
        });
    }
}
