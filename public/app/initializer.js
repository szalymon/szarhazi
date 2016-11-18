/// <reference path="../typings/paper/paper.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />
define(["require", "exports", 'shapefile', "CanvasController"], function (require, exports, shapefile, CanvasController_1) {
    "use strict";
    $(function () {
        /*
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Great success! All the File APIs are supported.
        } else {
            alert('The File APIs are not fully supported in this browser.');
        }
        */
        console.log("Client is running...");
        $('#panelForDragging').draggable({ handle: ".panel-heading" });
        var canvas = document.getElementById('mainCanvas');
        var controller = new CanvasController_1.CanvasController(canvas);
        shapefile.ShapeParser.parseFile(null);
    });
});
