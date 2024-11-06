import type { ErrorRequestHandler } from "express";
import { HTTPStatusEnum } from "../constants";
import { logger } from "../utils";

export const unhandledExceptionsMiddleware: ErrorRequestHandler = (
	error,
	_req,
	res,
	_next,
) => {
	logger.error("Unhandled exception", error);
	res.status(HTTPStatusEnum.INTERNAL_SERVER_ERROR).json({
		message: "Something went wrong on the server. Please try again later.",
		error: process.env.NODE_ENV === "development" ? error.message : undefined,
	});
};
