// JavaScript source code
var config = require('./config');
var express = require('express');
var app = express();

//Read JSON object
console.log(config);

//Check https enable or not
if (config.hasOwnProperty('https'))
    console.log('App starting with HTTPS enabled');
else
    console.log('App starting with HTTPS disabled');

var PORT = process.env.PORT || 4119;

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log('Listening to port ' + PORT);
});
