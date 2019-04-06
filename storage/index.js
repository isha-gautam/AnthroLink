// JavaScript source code
var server = require('./app.js');
var storageModule;
var config = server.config;
var client;

// Use the following to require different types of DB
if (config.db.type =='mongo'){
    storageModule = require('./mongo/index.js');
    client = new storageModule(config);
}
else
    storageModule = require('sql');

client.mongo.init();
