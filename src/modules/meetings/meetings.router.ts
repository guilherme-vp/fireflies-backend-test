import express from "express";
import { MeetingRepository } from "./meetings.repository";
import { MeetingsService } from "./meetings.service";
import MeetingsController from "./meetings.controller";
import { validateExpress } from "../../middlewares";
import { objectIdParamSchema, paginationSchema } from "../../utils";
import { createMeetingSchema, updateTranscriptSchema } from "./schemas";
import { TasksService } from "../tasks/tasks.service";
import { TaskRepository } from "../tasks/tasks.repository";
import { AIBotService } from "../../services";

export const router = express.Router();

const taskRepository = new TaskRepository();
const meetingRepository = new MeetingRepository();
const tasksService = new TasksService(taskRepository);
const meetingsService = new MeetingsService(meetingRepository);
const botService = new AIBotService();
const meetingsController = new MeetingsController(
	meetingsService,
	tasksService,
	botService,
);

router.get(
	"/",
	validateExpress("query-params", paginationSchema.optional()),
	async (req, res) => {
		return meetingsController.getUserMeetings(req, res);
	},
);
router.get(
	"/:id/",
	validateExpress("params", objectIdParamSchema),
	async (req, res) => {
		return meetingsController.getMeetingById(req, res);
	},
);
router.post(
	"/",
	validateExpress("body", createMeetingSchema),
	async (req, res) => {
		return meetingsController.createMeeting(req, res);
	},
);
router.post(
	"/:id/summarize",
	validateExpress("params", objectIdParamSchema),
	async (req, res) => {
		return meetingsController.summarizeMeeting(req, res);
	},
);
router.get("/stats", async (req, res) => {
	return meetingsController.getMeetingsStats(req, res);
});
router.put(
	"/:id/transcript",
	validateExpress("params", objectIdParamSchema),
	validateExpress("body", updateTranscriptSchema),
	async (req, res) => {
		return meetingsController.updateMeetingTranscription(req, res);
	},
);

export { router as meetingRoutes };
