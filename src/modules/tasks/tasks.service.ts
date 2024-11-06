import { logger } from "../../utils";
import type { TaskSchemaParams } from "./schemas";
import type { TaskRepository } from "./tasks.repository";

export class TasksService {
	constructor(private readonly taskRepository: TaskRepository) {}

	public async getUserTasks(userId: string) {
		const tasks = await this.taskRepository.getByUserId(userId);
		logger.info("Found tasks for user", { userId });
		return tasks;
	}

	public async getMeetingTasks(meetingId: string) {
		const tasks = await this.taskRepository.getByMeetingId(meetingId);
		return tasks;
	}

	async createMeetingTasks(args: {
		meetingId: string;
		userId: string;
		tasks: TaskSchemaParams[];
	}) {
		const createdTasks = await this.taskRepository.createTasks(args);
		logger.info("Successfully created meeting tasks");
		return createdTasks;
	}
}
