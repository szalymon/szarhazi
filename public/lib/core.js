/// <reference path="./client-app.js" />

$(function () {

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        // Great success! All the File APIs are supported.
    } else {
        alert('The File APIs are not fully supported in this browser.');
    }

    console.log("Client is running...");

    var canvas = document.getElementById('mainCanvas');

    paper.setup(canvas);

    var path = new paper.Path();
    // Give the stroke a color
    path.strokeColor = 'black';
    var start = new paper.Point(100, 100);
    // Move to start and draw a line from there
    path.moveTo(start);
    // Note that the plus operator on Point objects does not work
    // in JavaScript. Instead, we need to call the add() function:
    path.lineTo(start.add([200, -50]));
    // Draw the view now:
    paper.view.draw();

    ShapeParser.parseFile(null);
});