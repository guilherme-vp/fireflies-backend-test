import { Task, type ITask } from "./models";

export class TaskRepository {
	async getByMeetingId(meetingId: string): Promise<ITask[]> {
		return await Task.find({ meetingId }).lean().exec();
	}

	async getByUserId(userId: string): Promise<ITask[]> {
		return await Task.find({ userId }).lean().exec();
	}
}
