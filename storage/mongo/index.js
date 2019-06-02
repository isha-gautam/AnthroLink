var MongoUtil = require('./utils');
var when = require('when');
var user = require('./user');
var ticket = require('./ticket');

module.exports = {
    init: MongoUtil.connectToServer,
    createUser: function (email, name, pwd, imgURL, provider, type) {
        return when.promise(function (resolve, reject) {
            user.checkUser(email).then(function (data) {
                if (!data || Object.keys(data).length == 0) {
                    user.createUser(email, name, pwd, imgURL, provider, type).then(function (data) {
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
    },
    checkUser: function (...args) {
        return user.checkUser(...args);
    },
    updateUser: function (...args) {
        return user.updateUser(...args);
    },
    fetchUser: function (...args) {
        return user.fetchUser(...args);
    },
    createFirstTicket: function (user, descr, raised) {
        return when.promise(function (resolve, reject) {
            user.checkUser(user.email).then(function (data) {
                if (Object.keys(data).length == 0)
                    return resolve({});
                ticket.createFirstTicket(descr, raised).then(function (data) {
                    user["ticket"] = data._id;
                    return resolve(data);
                }).otherwise(function (err) {
                    return reject(err);
                })
            }).otherwise(function (err) {
                return reject(err);
            })
        })
    },
    addNewOrgToTicket: function (uid, raised) {
        return when.promise(function (resolve, reject) {
            ticket.searchTicket(uid).then(function (tick) {
                if (Object.keys(tick).length != 0) {
                    ticket.addNewOrgToTicket(tick, raised).then(function (data) {
                        return resolve(data);
                    }).otherwise(function (err) {
                        return reject(err);
                    });
                }
                return resolve(data);
            }).otherwise(function (err) {
                return reject(err);
            });
        })
    }
};
