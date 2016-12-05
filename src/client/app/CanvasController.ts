import * as Paper from 'paper';
import { shapefile } from './shapefile';

export class CanvasController {

    canvas: HTMLCanvasElement;

    rightMouseButtonDown: boolean;
    leftMouseStillDown: boolean;

    zoomConstant: number = 1.25;

    tool: Paper.Tool;

    constructor(canvas: HTMLCanvasElement) {
        this.rightMouseButtonDown = false;
        this.leftMouseStillDown = false;
        this.tool = new Paper.Tool();
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

        //$(canvas).css("background-image", "url(http://wallpapercave.com/wp/Dq6o3uI.jpg)");
        //$(canvas).css("background-image", "assets/78ec6304-7552-4eef-b9fb-6fe3460440ba.png");

        $(canvas).mousewheel(e => {
            if (e.deltaY > 0) {
                this.zoomIn();
            } else if (e.deltaY < 0) {
                this.zoomOut();
            }
        });

        $(canvas).on('contextmenu', function() { return false; });

        $(canvas).mousedown(e => {
            if (e.button == 2) {
                this.rightMouseButtonDown = true;
                e.stopPropagation();
            } else if (e.button == 0) {
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
        this.setupEditor();
    }

    protected setupEditor() {
        var hitOptions = {
            segments: true,
            fill: true,
            stroke: true,
            tolerance: 0.005
        };

        var segment:Paper.Segment;
        var lastSelection:Paper.Item;
        this.tool.onMouseDown = e => {
            var hitResult = Paper.project.hitTest(e.point, hitOptions);
            if (!hitResult) {
                return;
            }

            var button = (<any>e).event.button;
            var item = hitResult.item;
            var type = hitResult.type;
            var isSelected = item.selected;
            if (type == 'segment') {
                if (isSelected) {
                    if (e.modifiers.control == true) {
                        hitResult.segment.remove();
                    } else {
                        segment = hitResult.segment;
                    }
                }
            } else if (type == 'fill') {
                if (button == 0) {
                    if(lastSelection) {
                        lastSelection.selected = false;
                    }
                    item.selected = true;
                    lastSelection = item;
                }
            } else if (type == 'stroke') {
                if (isSelected && e.modifiers.shift == true) {
                    var location = hitResult.location;
                    (<Paper.Path>hitResult.item).insert(location.index + 1, e.point);
                }
            }
        };

        this.tool.onMouseDrag = e => {
            if(segment) {
                segment.point.x = segment.point.x + e.delta.x;
                segment.point.y = segment.point.y + e.delta.y;
            }
        };

        this.tool.onMouseUp = e => {
            segment = undefined;
        };
    }
}
