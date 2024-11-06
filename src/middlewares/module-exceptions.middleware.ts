import type { ErrorRequestHandler } from "express";
import { logger } from "../utils";
import { ModuleError } from "../errors";

export const moduleExceptionsMiddleware: ErrorRequestHandler = (
	error,
	_req,
	res,
	next,
) => {
	if (error instanceof ModuleError) {
		logger.info({
			message: error.message,
			httpCode: error.httpCode,
			internalCode: error.message,
		});
		res.status(error.httpCode).json({
			message: error.message,
			internalCode: error.internalCode,
			metadata: error.metadata,
		});
	}
	// If not a module exception, treat as an unhandled exception
	next();
};
