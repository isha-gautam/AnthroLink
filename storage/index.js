// JavaScript source code
var server = require('./server.js');
var storageModule;
var config = server.config;

var client = new MongoClient(config);

client.mongo.init();

// Use the following to require different types of DB
if (config.db.type =='mongo')
    storageModule = require('./mongo/index.js');
else
    storageModule = require('sql');

