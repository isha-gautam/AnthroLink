var util = require('./utils');
var when = require('when');

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

    updateUser: function (updated, user) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var image;
            if (updated.type == "Citizen")
                image = "https://img.icons8.com/cotton/64/000000/gender-neutral-user.png";
            else
                image = "https://img.icons8.com/metro/52/000000/organization.png";
            if (!user.hasOwnProperty('tickets'))
                newVal = { $set: { name: updated.name, img: image, type: updated.type, address: updated.address, phone: updated.phone, bio: updated.bio } };
            else
                newVal = { $set: { name: updated.name, img: image, type: updated.type, address: updated.address, phone: updated.phone, bio: updated.bio, tickets: user.tickets } };
            db.collection("users").updateOne({ "_id": user._id }, newVal, function (err, data) {
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
                    log(err);
                    return reject(err);
                }
                return resolve(data);
            });
        })
    }
};