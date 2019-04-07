var MongoClient = require('mongodb').MongoClient;
var mydb;

module.exports = function (config) {

  connectToServer = new Promise(function (resolve, reject) {
    var url = "mongodb://" + config.host + ":" + config.port + "/" + config.name;
    MongoClient.connect(url, function (err, db) {
      mydb = db;
      if (err)
        reject(err);
      else
        return resolve();
    });
  }),

    getDb = function () {
      return mydb;
    }
};
