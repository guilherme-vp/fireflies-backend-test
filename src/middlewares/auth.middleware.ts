import type { Request, Response, NextFunction } from "express";
import { JWTService } from "../services";
import { logger } from "../utils";
import { AuthInvalidError } from "../errors";

export const authMiddleware = (
	req: Request & { userId?: string }, // req.userId might be undefined at this point
	_res: Response,
	next: NextFunction,
): void => {
	try {
		const jwtService = new JWTService();
		const token = req.headers.authorization?.split(" ")[1];
		if (!token) throw new Error("No token provided");

		const decoded = jwtService.verifyToken(token);
		const userId = typeof decoded !== "string" && decoded.userId;
		if (!userId) throw new Error("Invalid token");

		req.userId = userId;
		req.headers["x-user-id"] = userId;
		next();
	} catch (error) {
		logger.info(`Authentication failed ${error}`);
		throw new AuthInvalidError();
	}
};
