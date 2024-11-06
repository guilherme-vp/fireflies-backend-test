import { Task, type ITask } from "./models";

export class TaskRepository {
	async getTasksByUserId(userId: string): Promise<ITask[]> {
		return await Task.find({ userId }).lean().exec();
	}
}
