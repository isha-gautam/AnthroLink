var MongoUtil = require('utils.js');

module.exports = function (config) {
    init = function (config) {
        MongoUtil.connectToServer();
    }
};
