var util = require('./utils');
var when = require('when');
require('winston');
var log = require('../../src/log');

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
            var json = {};
            if (typeof email == "string") { //only email: for checking during registering
                json["_id"] = email;
                if (typeof pwd == "string")
                    json["pwd"] = pwd;
            }
            db.collection("users").find(json).toArray(function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        })
    },

    updateUser: function (updated) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var image;
            var newVal;
            if (typeof updated.address == "undefined")
                updated.address = null;
            if (typeof updated.phone == "undefined")
                updated.phone = null;
            if (typeof updated.bio == "undefined")
                updated.bio = null;
            if (typeof updated.phone == "undefined")
                updated.phone = null;
            if (updated.type == "Citizen")
                image = "https://img.icons8.com/cotton/64/000000/gender-neutral-user.png";
            else
                image = "https://img.icons8.com/metro/52/000000/organization.png";
            if (!updated.hasOwnProperty('tickets'))
                newVal = { $set: { name: updated.name, img: image, type: updated.type, address: updated.address, phone: updated.phone, bio: updated.bio } };
            else
                newVal = { $set: { name: updated.name, img: image, type: updated.type, address: updated.address, phone: updated.phone, bio: updated.bio, tickets: updated.tickets } };
            db.collection("users").updateOne({ _id: updated._id }, newVal, function (err, data) {
                if (err || data.matchedCount == 0)
                    return reject(err);
                return resolve(data);
            });
        })
    },

    fetchUser: function (searchStr) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            db.collection("users").find({ "$text": { "$search": searchStr } }).toArray(function (err, data) {
                if (err) {
                    log.error(err);
                    return reject(err);
                }
                return resolve(data);
            });
        })
    }
};