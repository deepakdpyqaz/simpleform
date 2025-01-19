import { createLogger, format, transports } from 'winston';

// Configure Winston logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
    ),
    transports: [
        new transports.File({ filename: '/var/logs/vihe.log' }), // Logs to 'logs/requests.log'
        new transports.Console({
            format: format.combine(
                format.colorize(),  // Optional: Adds colors to console logs
                format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
            )
        })
    ],
});

export default logger;