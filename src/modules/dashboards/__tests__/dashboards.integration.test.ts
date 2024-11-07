import request from "supertest";
import app from "../../../app";
import { JWTService } from "../../../services/jwt.service";
import { Meeting } from "../../meetings";
import { Task } from "../../tasks";

describe("Dashboards API", () => {
	let jwtToken: string;
	const userId = "test-user-id";

	beforeAll(() => {
		const jwtService = new JWTService();
		jwtToken = jwtService.generate({ userId });
	});

	beforeEach(async () => {
		await Task.deleteMany();
		await Meeting.deleteMany();
	});

	describe("GET /api/dashboard", () => {
		it("should require authorization", async () => {
			const response = await request(app).get("/api/dashboard");

			expect(response.status).toBe(401);
		});

		it("should return dashboard stats for the user", async () => {
			const currentYear = new Date().getFullYear();
			const meeting1 = await Meeting.create({
				userId,
				title: "Meeting 1",
				participants: ["John", "Jane"],
				date: new Date().setFullYear(currentYear + 1),
			});
			await Meeting.create({
				userId,
				title: "Meeting 2",
				transcript: "Transcript of meeting 2",
				participants: ["Alice", "Bob"],
				date: new Date().setFullYear(currentYear - 1),
			});
			await Meeting.create({
				userId,
				title: "Meeting 3",
				participants: ["Charlie"],
				date: new Date().setFullYear(currentYear + 1),
			});

			await Task.create({
				meetingId: meeting1.id,
				userId,
				title: "Task 1",
				description: "Pending task 1",
				status: "pending",
				dueDate: new Date().setFullYear(currentYear + 1),
			});
			await Task.create({
				meetingId: meeting1.id,
				userId,
				title: "Task 2",
				description: "In progress task 2",
				status: "in-progress",
				dueDate: new Date().setFullYear(currentYear - 1),
			});
			await Task.create({
				meetingId: meeting1.id,
				userId,
				title: "Task 3",
				description: "Complete task 3",
				status: "completed",
				dueDate: new Date().setFullYear(currentYear - 1),
			});

			// Make request to get dashboard stats
			const response = await request(app)
				.get("/api/dashboard")
				.auth(jwtToken, { type: "bearer" });

			expect(response.status).toBe(200);
			expect(response.body).toHaveProperty("totalMeetings", 3);
			expect(response.body.taskSummary).toHaveProperty("pending", 1); // Task 1
			expect(response.body.taskSummary).toHaveProperty("inProgress", 1); // Task 2
			expect(response.body.taskSummary).toHaveProperty("completed", 1); // Task 3
			expect(response.body.upcomingMeetings).toHaveLength(2); // Meeting 1 & 3
			expect(response.body.overdueTasks).toHaveLength(1); // Task 2, Task 3 is already completed
		});
	});
});
