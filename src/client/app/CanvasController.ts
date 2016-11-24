import * as Paper from 'paper';

export class CanvasController {

    path: Paper.Path;
    canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setupCanvas(this.canvas);

        this.path = new Paper.Path();
        this.path.fullySelected = true;

    }

    protected setupCanvas(canvas: HTMLCanvasElement): void {
        Paper.setup(canvas);

        canvas.addEventListener('click', (e) => {

            this.path.add(new Paper.Point(e.offsetX, e.offsetY));
            console.log(e);
        });
    }
}
