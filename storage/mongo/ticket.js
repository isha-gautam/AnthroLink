var util = require('./utils');
var when = require('when');
var user = require('./user');
module.exports = {
    createFirstTicket: function (descr, raised) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var obj = { "descr": descr, "raised": raised };
            db.collection("tickets").insertOne(obj, function (err, data) {
                if (err)
                    return reject(err);
                return resolve(data);
            })
        });
    },

    addNewOrgToTicket: function (ticket, addRaised) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            var newRaised = ticket.raised + addRaised;
            db.collection("tickets").updateOne({ _id: ticket._id }, { $set: { "raised": newRaised } }, function (err, res) {
                if (err)
                    return reject(err);
                return resolve(data);
            });
        })
    },

    searchTicket: function (uid) {
        return when.promise(function (resolve, reject) {
            var db = util.getDb();
            obj = db.collection("tickets").find({ _id: uid }).toArray(function (err, data) {
                if (err)
                    return reject(err);
                if (Object.keys(data).length == 0)
                    return resolve({});
                return resolve(data);
            });
        })
    }
};