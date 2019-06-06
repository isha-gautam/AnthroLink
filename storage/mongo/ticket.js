var util = require('./utils');
var when = require('when');
var user = require('./user');
module.exports = {
    createTicket: function (citEmail, orgEmail, startDate, endDate, TDescr, type) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var today = new Date();
            var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date + ' ' + time;
            var obj = { "citEmail": citEmail, "orgEmail": orgEmail, "startDate": pickup, "endDate": endDate, "Descr": TDescr, "type": type, "createdOn": dateTime, "status": "pending" };
            db.collection("tickets").insertOne(obj, function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            })
        });
    },

    searchTicket: function (citEmail, orgEmail) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var obj = {};
            if (typeof citEmail == "string")
                obj["citEmail"] = citEmail;
            if (typeof orgEmail == "string")
                obj["orgEmail"] = orgEmail;
            db.collection("tickets").find(obj).toArray(function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        })
    },

    upadateTicketStat: function (citEmail, orgEmail, newStat) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            newVal = { $set: { status: newStat } };
            db.collection("users").updateOne({ "citEmail": citEmail, "orgEmail": orgEmail }, newVal, function (err, data) {
                if (err || data.matchedCount == 0)
                    return reject(err);
                return resolve(data);
            });
        })
    }
};