import morgan from "morgan";
import { logger } from "../utils/logger.util";

export const loggerMiddleware = morgan(
	":method :url :status :res[content-length] - :response-time ms",
	{
		stream: {
			write: (message) => {
				logger.http(message);
			},
		},
	},
);
