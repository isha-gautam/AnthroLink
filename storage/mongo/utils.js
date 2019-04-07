var MongoClient = require('mongodb').MongoClient;
require('when.js');

var mydb;

module.exports = {
  connectToServer: function (config) {
    return when.promise(function (resolve, reject) {
      var url = "mongodb://" + config.host + ":" + config.port + "/" + config.name;
      MongoClient.connect(url, function (err, db) {
        if (!config.host || !config.port || !config.name) {
          var err = "Wrong URL of DB";
          reject(err);
        }
        mydb = db;
        if (err)
          reject(err);
        else
          return resolve();
      });
    })
  },

  getDb = function () {
    return mydb;
  }
};
