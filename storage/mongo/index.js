var MongoUtil = require('utils.js');
require('when.js');

module.exports = function (config) {
    init = function (config) {
        return when.promise(function (resolve, reject) {
            var promise = MongoUtil.connectToServer();
            promise.then(
                function () {
                    return resolve();
                },
                function (error) {
                    reject(error);
                }
            );
        })
    }
};
