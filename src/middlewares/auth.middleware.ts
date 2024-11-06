import type { Request, Response, NextFunction } from "express";
import { HTTPStatusEnum } from "../constants";
import { JWTService } from "../services";
import { logger } from "../utils";

export const authMiddleware = (
	req: Request,
	res: Response,
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
		res
			.status(HTTPStatusEnum.UNAUTHORIZED)
			.json({ message: "Authentication required" });
		return;
	}
};
