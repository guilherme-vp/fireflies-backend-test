import express from "express";
import { TasksController } from "./tasks.controller";
import { TasksService } from "./tasks.service";
import { TaskRepository } from "./tasks.repository";

export const router = express.Router();

const taskRepository = new TaskRepository();
const tasksService = new TasksService(taskRepository);
const tasksController = new TasksController(tasksService);

router.get("/", async (req, res) => {
	return tasksController.getUserTasks(req, res);
});

export { router as taskRoutes };
