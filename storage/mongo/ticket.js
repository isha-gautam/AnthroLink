var util = require('./utils');
var when = require('when');
var uuid = require('uuid-random');

module.exports = {
    createTicket: function (citName, citEmail, orgName, orgEmail, startDate, endDate, TDescr, type) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            var obj = { _id: uuid(), "citName": citName, "citEmail": citEmail, "orgName": orgName, "orgEmail": orgEmail, "startDate": startDate, "endDate": endDate, "Descr": TDescr, "type": type, "createdOn": dateTime, "status": "pending" };
            db.collection("tickets").insertOne(obj, function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            })
        });
    },

    searchTicket: function (email) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            obj = { $or: [{ citEmail: email }, { orgEmail: email }] };
            db.collection("tickets").find(obj).toArray(function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        })
    },

    updateTicketStat: function (id, newStat) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            newVal = { $set: { status: newStat } };
            db.collection("tickets").updateOne({ "_id": id }, newVal, function (err, data) {
                if (err || data.matchedCount == 0)
                    return reject(err);
                return resolve(data);
            });
        })
    },

    deleteTicket: function (id) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            db.collection("users").deleteOne({ "_id": id }, function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        })
    }
};