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
            ticket.createTicket(citEmail, orgEmail, startDate, endDate, TDescr, type).then(function (tickData) {
                user.fetchUser(citEmail).then(function (citData) {
                    user.fetchUser(orgEmail).then(function (orgData) {
                        if (typeof citData.tickets == "undefined")
                            citData.tickets[0] = tickData._id;
                        // citData["tickets"] = tickData._id;
                        else
                            citData.tickets[citData.tickets.length] = tickData._id;
                        // citData.tickets += tickData._id;

                        if (typeof orgData.tickets == "undefined")
                            orgData.tickets[0] = tickData._id;
                        // orgData["tickets"] = tickData._id;
                        else
                            orgData.tickets[orgData.tickets.length] = tickData._id;
                        // orgData.tickets += ticketData._id;

                        return resolve(data);
                    }).otherwise(function (err) {
                        return reject(err);
                    });
                }).otherwise(function (err) {
                    return reject(err);
                });
            })
        })
    },
    searchTicket: function (...args) {
        return ticket.searchTicket(...args);
    }
};
