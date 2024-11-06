import { logger } from "../../utils";
import type { TaskRepository } from "./tasks.repository";

export class TasksService {
	constructor(private readonly taskRepository: TaskRepository) {}

	public async getUserTasks(userId: string) {
		const tasks = await this.taskRepository.getByUserId(userId);
		logger.info("Found tasks for user", { userId });
		return tasks;
	}
}
