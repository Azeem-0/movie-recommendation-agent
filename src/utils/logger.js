import { createLogger, transports, format } from "winston";

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    transports: [
        new transports.Console({
            format: format.simple()
        }),
        new transports.File({
            filename: 'logs/mongodb-connection.log',
            handleExceptions: true
        })
    ]
});
export default logger;