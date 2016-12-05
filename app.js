var express = require('express');
var app = express();
var file = require("./appserver/server/index");

app.use('/', express.static('dist'));
app.use('/', express.static('node_modules'));

app.listen(3000, function() {
    console.log('Server has been started.')
});

app.get('/askforfile', function(req, res) {
    res.send(file.getWorld());
    console.log("Runned"); 
});

var re = file.getWorld();