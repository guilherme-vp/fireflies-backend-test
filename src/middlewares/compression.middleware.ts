import compression from "compression";
import { settings } from "../config";
import type { Request, Response } from "express";

export const compressionMiddleware = compression({
	filter: shouldCompress,
});

function shouldCompress(req: Request, res: Response) {
	// don't compress responses with the x-no-compression request header
	// or if in development environment
	if (
		req.headers["x-no-compression"] ||
		settings.app.environment === "development"
	) {
		return false;
	}
	// fallback to standard filter function
	return compression.filter(req, res);
}
