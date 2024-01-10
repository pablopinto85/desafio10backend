const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const logFormat = winston.format.printf(({ level, message, timestamp }) => {
 return `${timestamp} [${level}]: ${message}`;
});

const logger = winston.createLogger({
 level: process.env.LOG_LEVEL || 'info',
 format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    logFormat
 ),
 transports: [
    new winston.transports.Console(),
    new DailyRotateFile({
      filename: 'errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
      ),
    }),
 ],
});

module.exports = logger;
  