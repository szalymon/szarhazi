import * as Paper from 'paper';
import { shapefile } from './shapefile';

export class CanvasController {

    path: Paper.Path;
    canvas: HTMLCanvasElement;

    rightMouseButtonDown: boolean;
    leftMouseStillDown: boolean;

    zoomConstant: number = 1.25;

    constructor(canvas: HTMLCanvasElement) {
        this.rightMouseButtonDown = false;
        this.leftMouseStillDown = false;
        this.setupCanvas(canvas);
    }

    protected zoomIn() {
        var newValue = Paper.view.zoom * this.zoomConstant;
        Paper.view.zoom = newValue;
    }

    protected zoomOut() {
        var newValue = Paper.view.zoom * (1 / this.zoomConstant);
        Paper.view.zoom = newValue;
    }

    protected setupCanvas(canvas: HTMLCanvasElement): void {
        Paper.setup(canvas);
        Paper.view.center = new Paper.Point(0, 0);
        Paper.view.zoom = 5;

        $('#zoom-out').click(() => {
            this.zoomOut();
        });
        $('#zoom-in').click(() => {
            this.zoomIn();
        });

        $(canvas).css("background-image", "url(http://wallpapercave.com/wp/Dq6o3uI.jpg)");

        $(canvas).mousewheel(e => {
            if(e.deltaY > 0) {
                this.zoomIn();
            } else if(e.deltaY < 0) {
                this.zoomOut();
            }
        });

        $(canvas).on('contextmenu', function() { return false; });

        $(canvas).mousedown(e => {
            if (e.button == 2) {
                this.rightMouseButtonDown = true;
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
