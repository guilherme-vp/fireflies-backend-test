import { DashboardsService } from "../dashboards.service";
import { MeetingRepository } from "../../meetings/meetings.repository";
import { TaskRepository } from "../../tasks/tasks.repository";

jest.mock("../../meetings/meetings.repository");
jest.mock("../../tasks/tasks.repository");

describe("DashboardsService", () => {
	let dashboardsService: DashboardsService;
	let mockMeetingRepository: jest.Mocked<MeetingRepository>;
	let mockTaskRepository: jest.Mocked<TaskRepository>;

	const userId = "test-user-id";

	beforeEach(() => {
		mockMeetingRepository =
			new MeetingRepository() as jest.Mocked<MeetingRepository>;
		mockTaskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;

		// Instantiate the service with the mocked repositories
		dashboardsService = new DashboardsService(
			mockMeetingRepository,
			mockTaskRepository,
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("getMeetingsStats", () => {
		it("should fetch user's dashboard stats successfully", async () => {
			const fakeTasks = [
				{
					_id: "task-id-1",
					meetingId: "meeting-id-1",
					title: "Task 1",
					meetingTitle: "Task 1",
					dueDate: new Date(),
				},
				{
					_id: "task-id-2",
					meetingId: "meeting-id-1",
					title: "Task 2",
					meetingTitle: "Task 2",
					dueDate: new Date(),
				},
			];
			const fakeMeetings = [
				{ _id: "meeting-id-1", title: "Meeting 1" },
				{ _id: "meeting-id-2", title: "Meeting 2" },
			];

			mockMeetingRepository.countByUserId.mockResolvedValue(6);
			mockTaskRepository.getGroupedTasksByStatus.mockResolvedValue({
				pending: 3,
				completed: 2,
				inProgress: 1,
			});
			mockMeetingRepository.getUpcomingMeetings.mockResolvedValue(fakeMeetings);
			mockTaskRepository.getOverdueTasks.mockResolvedValue(fakeTasks);

			const result = await dashboardsService.getMeetingsStats(userId);

			expect(result.totalMeetings).toEqual(6);
			expect(result.overdueTasks).toEqual(fakeTasks);
			expect(result.taskSummary).toEqual({
				pending: 3,
				completed: 2,
				inProgress: 1,
			});
			expect(result.upcomingMeetings).toEqual(fakeMeetings);
		});
	});
});
