import express from "express";
import { Task } from "./models";
import type { AuthenticatedRequest } from "../../middlewares";

export const router = express.Router();

router.get("/", async (req: AuthenticatedRequest, res) => {
	try {
		const tasks = await Task.find({ userId: req.userId });
		res.json(tasks);
	} catch (err) {
		res.status(500).json({ message: (err as Error).message });
	}
});

export { router as taskRoutes };
