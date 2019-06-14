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
    createTicket: function (citName, citEmail, orgName, orgEmail, startDate, endDate, TDescr, type) {
        return when.promise(function (resolve, reject) {
            ticket.createTicket(citName, citEmail, orgName, orgEmail, startDate, endDate, TDescr, type).then(function (tick) {
                var tickData = tick.ops[0];
                user.checkUser(citEmail, null).then(function (cit) {
                    var citData = cit[0];
                    user.checkUser(orgEmail, null).then(function (org) {
                        var orgData = org[0];
                        var arr = citData.tickets;
                        if (typeof arr == "undefined")
                            arr = new Array();
                        arr.push(tickData._id);
                        citData.tickets = arr;

                        arr = orgData.tickets;
                        if (typeof arr == "undefined")
                            arr = new Array();
                        arr.push(tickData._id);
                        orgData.tickets = arr;

                        user.updateUser(citData).then(function (data) {
                            user.updateUser(orgData).then(function (data) {
                                ticket.deleteTicket(tickData._id);
                                return resolve(data);
                            }).otherwise(function (err) {
                                ticket.deleteTicket(tickData._id);
                                return reject(err);
                            });
                        }).otherwise(function (err) {
                            ticket.deleteTicket(tickData._id);
                            return reject(err);
                        });
                    }).otherwise(function (err) {
                        ticket.deleteTicket(tickData._id);
                        return reject(err);
                    });
                }).otherwise(function (err) {
                    ticket.deleteTicket(tickData._id);
                    return reject(err);
                });
            }).otherwise(function (err) {
                return reject(err);
            })
        })
    },
    searchTicket: function (...args) {
        return ticket.searchTicket(...args);
    },
    updateTicketStat: function (...args) {
        return ticket.updateTicketStat(...args);
    }
};
