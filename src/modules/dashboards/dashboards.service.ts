import { logger } from "../../utils";
import type { MeetingRepository } from "../meetings/meetings.repository";
import type { TaskRepository } from "../tasks/tasks.repository";

export class DashboardsService {
	constructor(
		private readonly meetingRepository: MeetingRepository,
		private readonly taskRepository: TaskRepository,
	) {}

	public async getMeetingsStats(userId: string) {
		const [totalMeetings, taskSummary, upcomingMeetings, overdueTasks] =
			await Promise.all([
				await this.meetingRepository.countByUserId(userId),
				await this.taskRepository.getGroupedTasksByStatus(userId),
				await this.meetingRepository.getUpcomingMeetings(userId),
				await this.taskRepository.getOverdueTasks(userId),
			]);

		logger.info("Found user's dashboard stats");
		const dashboardData = {
			totalMeetings,
			taskSummary,
			upcomingMeetings,
			overdueTasks,
		};
		return dashboardData;
	}
}
