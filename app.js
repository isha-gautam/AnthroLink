// JavaScript source code
var config = require('./config');
var express = require('express');
var app = express();
var Server;
var http = require('http');
var https = require('https');
var storageModule = require('storage');

var PORT = process.env.PORT || 8080;

storageModule.init(config);

// Check https enable or not
if (config.hasOwnProperty('https')) {
    var credentials = { key: config.https.key, cert: config.https.cert };
    Server = https.createServer(credentials, app);
    console.log('App starting with HTTPS enabled');
}
else {
    Server = http.createServer(app);
    console.log('App starting with HTTP enabled');
}

app.get('/', function (req, res) {
    res.send('Hello World');
});


Server.listen(PORT, () => {
    console.log('Listening to port ' + PORT);
});

