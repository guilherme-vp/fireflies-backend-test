import express from "express";
import { MeetingRepository } from "./meetings.repository";
import { MeetingsService } from "./meetings.service";
import MeetingsController from "./meetings.controller";
import { authMiddleware, validateExpress } from "../../middlewares";
import { paginationSchema } from "../../utils";

export const router = express.Router();

const meetingRepository = new MeetingRepository();
const meetingsService = new MeetingsService(meetingRepository);
const meetingsController = new MeetingsController(meetingsService);

router.get(
	"/",
	authMiddleware,
	validateExpress("params", paginationSchema),
	async (req, res) => {
		return meetingsController.getUserMeetings(req, res);
	},
);

export { router as meetingRoutes };
