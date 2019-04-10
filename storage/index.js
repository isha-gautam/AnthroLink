// JavaScript source code
require('when');
var storageModule;

module.exports = {
    init: function (config) {
        return when.promise(function (resolve, reject) {

            //Use following type of structure to require different types of DB
            if (config.db.type == 'mongo')
                storageModule = require('mongo');
            //Add else if..else to require other DB
            /*else
                storageModule = require('sql');
            */
            storageModule.init(config).then(
                function (data) {
                    resolve();
                }).otherwise(
                    function (error) {
                        reject(error);
                    }
                );
        })
    }
};
