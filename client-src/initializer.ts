/// <reference path="../typings/paper/paper.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
/// <reference path="../typings/jqueryui/jqueryui.d.ts" />

import shapefile = require('shapefile');
import {CanvasController} from "CanvasController";

import Paper = require('paper'); 

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

    var canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');

    let controller = new CanvasController(canvas);

    shapefile.ShapeParser.parseFile(null);
});