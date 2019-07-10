var MongoClient = require('mongodb').MongoClient;
var when = require('when');

var mydb;

module.exports = {
  connectToServer: function (config) {
    return when.promise(function (resolve, reject) {
      if (!config.db.host || !config.db.port || !config.db.name) {
        var err = "Wrong URL of DB";
        reject(err);
      }
      var url = 'mongodb://' + config.db.host + ':' + config.db.port;
      MongoClient.connect(url, function (err, client) {
        if (err)
          return reject(err);
        else {
          mydb = client.db('AnthroLinkDB');
          mydb.createCollection("users", function (err, data) {
            if (err)
              return reject(err);
          });
          mydb.collection("users").createIndex({ name: "text", email: "text", address: "text", description: "text" }, function (err, name) {
            if (err)
              return reject(err);
          });
          return resolve();
        }
      });
    })
  },

  getDb: function () {
    return mydb;
  }
};
