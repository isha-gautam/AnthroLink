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
    fetchUser: function (...args) {
        return storageModule.fetchUser(...args);
    },
    createTicket: function (...args) {
        return storageModule.createTicket(...args);
    },
    searchTicket:function(...args){
        return storageModule.searchTicket(...args);
    },
    updateTicketStat: function (...args) {
        return storageModule.updateTicketStat(...args);
    }
};
