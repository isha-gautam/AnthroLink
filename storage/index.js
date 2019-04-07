// JavaScript source code
var storageModule;

module.exports() = {
    init = function (config) {
        //Use following type of structure to require different types of DB
        if(config.db.type == 'mongo')
            storageModule = require('./mongo/index.js');
        //Add else if..else to require other DB
        /*else
            storageModule = require('sql');
        */
        storageModule.init(config);
    }
};
