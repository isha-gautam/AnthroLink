var MongoUtil = require('./utils');
var when = require('when');
var user = require('./user');

module.exports = {
    init: MongoUtil.connectToServer,
    createUser: function (Id, name, email, pwd, imgURL, provider) {
        return when.promise(function (resolve, reject) {
            user.checkUser(email, provider).then(function (data) {
                if (Object.keys(data).length == 0) {
                    user.createUser(Id, name, email, pwd, imgURL, provider).then(function (data) {
                        return resolve(data);
                    }).otherwise(function (err) {
                        return reject(err);
                    })
                }
                return resolve(data);
            }).otherwise(function (err) {
                return reject(err);
            });
        })
    }
};
