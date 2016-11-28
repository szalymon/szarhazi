import { shapefile } from './app/shapefile';
import { CanvasController } from "./app/CanvasController";
import * as Paper from 'paper';
import { WorldDrawer } from './app/WorldDrawer';


$(function () {
    /*
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }
    */

    $('#panelForDragging').draggable({ handle: ".panel-heading" });

    var canvas = <HTMLCanvasElement>document.getElementById('mainCanvas');

    let controller = new CanvasController(canvas);

    var fileInput = <HTMLInputElement>document.getElementById("fileLoaderBtn");

    fileInput.oninput = () => {
        var file = fileInput.files[0];
        console.log("Start loading!");
        shapefile.ShapeParser.parseFile(file, (world) => {
            //controller.drawWorld(world);
            console.log("Loading is finished!");
            WorldDrawer.drawWorld(world);
        });
    }

    console.log("Page has been loaded!");
});