var util = require('./utils');
var when = require('when');
var uuid = require('uuid-random');
module.exports = {
    createUser: function (email, name, pwd, imgURL, provider, type) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var obj;
            if (provider == "google")
                obj = { _id: email, "name": name, "img": imgURL, "provider": provider, "type": type };
            else
                obj = { _id: email, "name": name, "pwd": pwd, "img": imgURL, "provider": provider, "type": type };
            db.collection("users").insertOne(obj, function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        });
    },

    checkUser: function (email, pwd) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            if (typeof email == "string") { //only email: for checking during registering
                json = { "_id": email };
                if(typeof pwd=="string")
                json["pwd"] = pwd;
            }
            db.collection("users").find(json).toArray(function (err, data) {
                if (err)
                    return reject(err);
                if (Object.keys(data).length == 0) {
                    console.log("no such user");
                    return resolve({});
                }
                return resolve(data);
            });
        })
    },

    updateUser: function (updated) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            newVal = { $set: { name: updated.name, img: updated.img, address: updated.address, phone: updated.phone } };
            db.collection("users").updateOne({ "_id": updated._id }, newVal, function (err, data) {
                if (err || data.matchedCount == 0)
                    return reject(err);
                return resolve(data);
            });
        })
    },

    fetchUser: function (searchStr) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            db.collection("users").find({ $text: { $search: searchStr } }).then(function (data) {
                if (Object.keys(data).length == 0)
                    return reject(err);
                console.log(data);
                return resolve(data);
            }).otherwise(function (err) {
                console.log("in user.js fetch user" + err);
                return reject(err);
            });
        })
    }
};