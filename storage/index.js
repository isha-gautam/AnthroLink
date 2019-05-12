// JavaScript source code
var when = require('when');
var storageModule;

module.exports = {
    init: function (config) {
        return when.promise(function (resolve, reject) {

            //Use following type of structure to require different types of DB
            if (config.db.type == 'mongo')
                storageModule = require('./mongo');
            //Add else if..else to require other DB
            /*else
                storageModule = require('sql');
            */
            storageModule.init(config).then(function (data) {
                return resolve(data);
            }).otherwise(function (err) {
                return reject(err);
            });
        })
    },
    createUser: function (...args) {
        return storageModule.createUser(...args);
    },
    updateUser: function (...args) {
        return storageModule.createUser(...args);
    },
    findOrg: function (...args) {
        return storageModule.findOrg(...args);
    }
};
