var MongoUtil = require('utils.js');

module.exports = function(config){
    new MongoUtil(config).init();
};
