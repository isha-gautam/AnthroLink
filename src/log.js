var winston = require('winston');
require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)({
    filename: 'C:/Users/ISHA/Desktop/REPOS/AnthroLink/logs/AnthroLink-%DATE%.log',
    datePattern: 'YYY-MM-DD-HH',
    maxSize: '20m',
    maxFiles: '30d'
});

const Logger = winston.createLogger({
    transports: [
        transport
    ]
});

module.exports = Logger;


