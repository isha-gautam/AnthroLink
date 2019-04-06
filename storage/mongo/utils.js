var MongoClient = require( 'mongodb' ).MongoClient;
var mydb;

module.exports = function(config){

  init = function ( callback ) {
    MongoClient.connect( "mongodb://localhost:27017/AnthroLinkDB", function( err, db ) {
      mydb = db;
      return callback( err );
    } );
  }

  getDb = function() {
    return mydb;
  }
};