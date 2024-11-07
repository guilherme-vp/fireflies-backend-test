import request from "supertest";
import mongoose from "mongoose";
import app from "../../../app";
import { Task } from "../models";
import { JWTService } from "../../../services/jwt.service";

describe("Tasks API", () => {
	let jwtToken: string;
	const userId = "test-user-id";

	beforeAll(() => {
		const jwtService = new JWTService();
		jwtToken = jwtService.generate({ userId });
	});

	describe("GET /api/tasks", () => {
		it("should require authorization", async () => {
			const response = await request(app).get("/api/tasks");

			expect(response.status).toBe(401);
		});

		it("should return an empty array if no tasks are found for the user", async () => {
			const response = await request(app)
				.get("/api/tasks")
				.auth(jwtToken, { type: "bearer" });

			expect(response.status).toBe(200);
			expect(response.body).toEqual([]);
		});

		it("should return all tasks for a specific user", async () => {
			await Task.create([
				{
					meetingId: new mongoose.Types.ObjectId(),
					userId,
					title: "Task 1",
					description: "Description for Task 1",
					status: "pending",
					dueDate: new Date(),
				},
				{
					meetingId: new mongoose.Types.ObjectId(),
					userId,
					title: "Task 2",
					description: "Description for Task 2",
					status: "completed",
					dueDate: new Date(),
				},
				{
					meetingId: new mongoose.Types.ObjectId(),
					userId: "other-user-id",
					title: "Task 3",
					description: "Description for Task 3",
					status: "in-progress",
					dueDate: new Date(),
				},
			]);

			const response = await request(app)
				.get("/api/tasks")
				.auth(jwtToken, { type: "bearer" });

			expect(response.status).toBe(200);
			expect(response.body).toHaveLength(2);
			expect(response.body[0]).toMatchObject({
				title: "Task 1",
				description: "Description for Task 1",
				status: "pending",
			});
			expect(response.body[1]).toMatchObject({
				title: "Task 2",
				description: "Description for Task 2",
				status: "completed",
			});
		});
	});
});
