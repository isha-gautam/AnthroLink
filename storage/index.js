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
    checkUser: function (...args) {
        return storageModule.checkUser(...args);
    },
    updateUser: function (...args) {
        return storageModule.updateUser(...args);
    },
    searchUser: function (...args) {
        return storageModule.searchUser(...args);
    },
    createTicket: function (user, descr, raised) {
        return when.promise(function (resolve, reject) {
            if (user.hasOwnProperty('raised')) {
                storageModule.createFirstTicket(descr, raised).then(function (data) {
                    return resolve(data);
                }).otherwise(function (err) {
                    return reject(err);
                });
            } else {
                storageModule.addNewOrgToTicket(user._id, raised).then(function (data) {
                    return resolve(data);
                }).otherwise(function (err) {
                    return reject(err);
                });
            }
        })
    }
};
