var util = require('./utils');
var when = require('when');
var uuid = require('uuid-random');
module.exports = {
    createUser: function (Id, name, email, pwd, imgURL, provider) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var obj;
            if (provider == "google")
                obj = { _id: uuid(), gid: Id, "name": name, "email": email, "img": imgURL, "provider": provider };
            else
                obj = { _id: uuid(), "email": email, "pwd": pwd, "provider": provider };
            db.collection("users").insertOne(obj, function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        });
    },

    checkUser: function (email, provider) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var json = { "email": email, "provider": provider };
            obj = db.collection("users").find(json).toArray(function (err, data) {
                if (err)
                    return reject(err);
                if (Object.keys(data).length == 0) {
                    return resolve({});
                }
                return resolve(data);
            });
        })
    }

};