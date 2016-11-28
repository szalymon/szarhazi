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

    protected setBg(){
        var ctx = this.canvas.getContext("2d");
        var bg = new Image();
        bg.src = "http://hd.wallpaperswide.com/thumbs/football_pitch-t2.jpg";

        // Make sure the image is loaded first otherwise nothing will draw.
        bg.onload = function(){
            ctx.drawImage(bg,0,0);
        }​
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

        $(canvas).on('drag', function(){ this.setBg(); });

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
                this.setBg();
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
