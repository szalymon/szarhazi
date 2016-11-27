import {shapefile} from './app/shapefile';
import {CanvasController} from "./app/CanvasController";
import * as Paper from 'paper';



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