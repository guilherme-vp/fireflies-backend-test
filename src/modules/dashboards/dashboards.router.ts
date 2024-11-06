import express from "express";
import DashboardsController from "./dashboards.controller";
import { DashboardsService } from "./dashboards.service";
import { TaskRepository } from "../tasks/tasks.repository";
import { MeetingRepository } from "../meetings/meetings.repository";

const meetingRepository = new MeetingRepository();
const taskRepository = new TaskRepository();
const dashboardsService = new DashboardsService(
	meetingRepository,
	taskRepository,
);
const dashboardsController = new DashboardsController(dashboardsService);

const router = express.Router();

router.get("/", async (req, res) => {
	return dashboardsController.getDashboardStats(req, res);
});

export { router as dashboardRoutes };
