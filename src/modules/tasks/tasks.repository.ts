import { Task, type ITask } from "./models";

export class TaskRepository {
	async getByMeetingId(meetingId: string): Promise<ITask[]> {
		return await Task.find({ meetingId }).lean().exec();
	}

	async getByUserId(userId: string): Promise<ITask[]> {
		return await Task.find({ userId }).lean().exec();
	}

	async getOverdueTasks(userId: string) {
		return await Task.aggregate([
			{
				$match: {
					userId,
					dueDate: { $lt: new Date() },
					status: { $ne: "completed" },
				},
			},
			{
				$lookup: {
					from: "meetings",
					localField: "meetingId",
					foreignField: "_id",
					as: "meeting",
				},
			},
			{ $unwind: "$meeting" },
			{
				$project: {
					_id: 1,
					title: 1,
					dueDate: 1,
					meetingId: "$meeting._id",
					meetingTitle: "$meeting.title",
				},
			},
			{
				$sort: {
					dueDate: 1,
				},
			},
		]);
	}

	async getGroupedTasksByStatus(userId: string) {
		const groupedStatuses = await Task.aggregate<{
			_id: ITask["status"];
			count: number;
		}>([
			{ $match: { userId } },
			{
				$group: {
					_id: "$status",
					count: { $sum: 1 },
				},
			},
		]);

		const tasksByStatus = {
			pending: 0,
			inProgress: 0,
			completed: 0,
		};
		for (const group of groupedStatuses) {
			if (group._id === "in-progress") {
				tasksByStatus.inProgress = group.count;
			} else {
				tasksByStatus[group._id] = group.count;
			}
		}

		return tasksByStatus;
	}
}
