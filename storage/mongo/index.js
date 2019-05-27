var MongoUtil = require('./utils');
var when = require('when');
var user = require('./user');
var ticket = require('./ticket');

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
    },
    checkUser: function (...args) {
        return user.checkUser(...args);
    },
    updateUser: function (...args) {
        return user.updateUser(...args);
    },
    searchUser: function (...args) {
        return user.searchUser(...args);
    },
    createFirstTicket: function (user, descr, raised) {
        return when.promise(function (resolve, reject) {
            user.checkUser(user.email, email.provider).then(function (data) {
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
    addNewOrgToTicket: function (id, raised) {
        return when.promise(function (resolve, reject) {
            ticket.searchTicket(id).then(function (data) {
                if (Object.keys(data).length != 0) {
                    ticket.addNewOrgToTicket(raised).then(function (Data) {
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
