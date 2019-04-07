var MongoUtil = require('utils.js');
require('when.js');

module.exports = {
    init: function (config) {
        return when.promise(function (resolve, reject) {
            MongoUtil.connectToServer().then(
                function () {
                    return resolve();
                }).otherwise(
                function (error) {
                    reject(error);
                }
            );
        })
    }
};
