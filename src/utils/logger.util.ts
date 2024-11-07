import winston from "winston";
import { settings } from "../config";

const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp, ...keys }) => {
	const keysString =
		Object.keys(keys).length > 0 ? `\n${JSON.stringify(keys, null, 2)}` : "";
	return `${timestamp} [${level}]: ${message}${keysString}`;
});

const PRODUCTION_TRANSPORTS = [
	// Log to the console
	new winston.transports.Console(),
	// Log to files for persistent logging
	new winston.transports.File({ filename: "logs/error.log", level: "error" }),
	new winston.transports.File({ filename: "logs/combined.log" }),
];

const logger = winston.createLogger({
	levels: winston.config.npm.levels,
	format: winston.format.json(),
	transports: PRODUCTION_TRANSPORTS,
	// Handle uncaught exceptions
	exceptionHandlers: [
		new winston.transports.File({ filename: "logs/exceptions.log" }),
	],
	// Handle unhandled promise rejections
	rejectionHandlers: [
		new winston.transports.File({ filename: "logs/rejections.log" }),
	],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (settings.app.environment === "development") {
	for (const transport of PRODUCTION_TRANSPORTS) {
		logger.remove(transport);
	}
	logger.add(
		new winston.transports.Console({
			level: "http",
			format: combine(
				timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
				colorize(),
				customFormat,
			),
		}),
	);
}

if (settings.app.environment === "test") {
	for (const transport of PRODUCTION_TRANSPORTS) {
		logger.remove(transport);
	}
}

export default logger;
