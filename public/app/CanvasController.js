/// <reference path="../typings/paper/paper.d.ts" />
define(["require", "exports", 'paper'], function (require, exports, Paper) {
    "use strict";
    var CanvasController = (function () {
        function CanvasController(canvas) {
            this.canvas = canvas;
            this.setupCanvas(this.canvas);
            this.path = new Paper.Path();
            this.path.fullySelected = true;
        }
        CanvasController.prototype.setupCanvas = function (canvas) {
            var _this = this;
            Paper.setup(canvas);
            canvas.addEventListener('click', function (e) {
                _this.path.add(new Paper.Point(e.offsetX, e.offsetY));
                console.log(e);
            });
        };
        return CanvasController;
    }());
    exports.CanvasController = CanvasController;
});
