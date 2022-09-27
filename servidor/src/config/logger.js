import { createLogger, format, transports } from 'winston';

const logger = createLogger({
    transports: [
        new transports.File({
            filename: 'logs/error.log',
            level: 'debug',
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            maxsize: 5242880, // 5MB
        }),
    ]
})


export default logger;