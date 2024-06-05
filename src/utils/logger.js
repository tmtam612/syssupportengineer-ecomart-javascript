const winston = require('winston');
const { combine, timestamp } = winston.format;
const path = require('path');
require('winston-daily-rotate-file');
const dailyRotateFileTransport = new winston.transports.DailyRotateFile({
    filename: 'JOY-DEVELOPER_logger_%DATE%',
    datePattern: 'YYYY-MM-DD',
    maxSize: '50m',
    zippedArchive: true,
    utc: true,
    dirname: './logs',
    extension: '.log',
});

const customFormat = winston.format.printf((payload) => {
    const { message, timestamp } = payload;
    return `${timestamp} ${message}`;
});

const winstonLogger = winston.createLogger({
    transports: [dailyRotateFileTransport, new winston.transports.Console()],
    levels: winston.config.npm.levels,
    format: combine(timestamp(), customFormat),
});

dailyRotateFileTransport.on('rotate', (oldFileName, newFileName) => {
    logger(`log file rotate [${oldFileName} -> ${newFileName}]`);
});

/**
 * show log to monitor
 * @param {String} message
 * @returns
 */
const logger = (message) => {
    winstonLogger.log('info', message);
};
module.exports = logger;
