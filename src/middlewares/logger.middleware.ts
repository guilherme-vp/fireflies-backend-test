import morgan from "morgan";
import { logger } from "../utils";

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
