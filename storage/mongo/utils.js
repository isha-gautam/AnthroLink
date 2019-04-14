var MongoClient = require('mongodb').MongoClient;
var when = require('when');

var mydb;

module.exports = {
  connectToServer: function (config) {
    return when.promise(function (resolve, reject) {
      if (config.db.host == null || config.db.port == null || config.db.name == null) {
        var err = "Wrong URL of DB";
        reject(err);
      }
      var url = 'mongodb://' + config.db.host + ':' + config.db.port ;
      MongoClient.connect(url, function (err, client) {
        if (err)
          return reject(err);
        else{
          mydb = client.db('AnthroLinkDB');
          return resolve();
        }
      });
    })
  },

  getDb: function () {
    return mydb;
  }
};
