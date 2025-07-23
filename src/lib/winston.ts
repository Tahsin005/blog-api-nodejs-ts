import winston from "winston";

import config from "@/config";

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

// transport array to hold different logging transports
const transports: winston.transport[] = [];

// console transport for logging to the console (in development)
console.log(`NODE_ENV: ${config.NODE_ENV}`);
if (config.NODE_ENV !== 'production') {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize({
                    all: true, // colorize all log levels
                }),
                timestamp({
                    format: 'YYYY-MM-DD hh:mm:ss.SSS A', // timestamp format
                }),
                align(),
                printf(({ level, message, timestamp, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta)}` : '';
                    return `${timestamp} [${level}]: ${message}${metaStr}`;
                })
            ),
        })
    );
}

// logger instance using winston
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info', // log level from config
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports,
    silent: config.NODE_ENV === 'test', // disable logging in test environment
});

export { logger };