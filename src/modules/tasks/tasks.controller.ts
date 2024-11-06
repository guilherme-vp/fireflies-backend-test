import type { Request, Response } from "express";
import type { TasksService } from "./tasks.service";
import { HTTPStatusEnum } from "../../constants";

export class TasksController {
	constructor(private readonly tasksService: TasksService) {}

	async getUserTasks(req: Request, res: Response) {
		const tasks = await this.tasksService.getUserTasks(req.userId);
		res.status(HTTPStatusEnum.OK).json(tasks);
	}
}

export default TasksController;
