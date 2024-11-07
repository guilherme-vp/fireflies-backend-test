import request from "supertest";
import app from "../../../app";
import { Meeting } from "../models";
import { AIBotService, JWTService } from "../../../services";
import mongoose from "mongoose";
import { logger } from "../../../utils";

jest.mock("../../../services/ai-bot.service");

describe("Meetings API", () => {
	let jwtToken: string;
	const userId = "test-user-id";

	beforeAll(() => {
		const jwtService = new JWTService();
		jwtToken = jwtService.generate({ userId });
	});

	describe("GET /api/meetings", () => {
		it("should require authorization", async () => {
			const response = await request(app).get("/api/meetings");

			expect(response.status).toBe(401);
		});

		it("should retrieve an empty array if user has no meetings", async () => {
			const response = await request(app)
				.get("/api/meetings")
				.auth(jwtToken, { type: "bearer" });

			expect(response.status).toBe(200);
			expect(response.body.data).toHaveLength(0);
		});

		describe("pagination params", () => {
			it("should retrieve all meetings within the limit", async () => {
				await Meeting.create([
					{
						userId,
						title: "Meeting 1",
						date: new Date(),
						participants: ["User1"],
					},
					{
						userId,
						title: "Meeting 2",
						date: new Date(),
						participants: ["User2"],
					},
					{
						userId,
						title: "Meeting 3",
						date: new Date(),
						participants: ["User2", "User3"],
					},
				]);

				const limit = 2;
				const page = 1;
				const response = await request(app)
					.get("/api/meetings")
					.auth(jwtToken, { type: "bearer" })
					.query({ page, limit });

				expect(response.status).toBe(200);
				expect(response.body.data).toHaveLength(2);
			});

			it("should retrieve all meetings within the limit for page 2", async () => {
				await Meeting.create([
					{
						userId,
						title: "Meeting 1",
						date: new Date(),
						participants: ["User1"],
					},
					{
						userId,
						title: "Meeting 2",
						date: new Date(),
						participants: ["User2"],
					},
					{
						userId,
						title: "Meeting 2",
						date: new Date(),
						participants: ["User2", "User3"],
					},
				]);

				const limit = 2;
				const page = 2;
				const response = await request(app)
					.get("/api/meetings")
					.auth(jwtToken, { type: "bearer" })
					.query({ page, limit });

				expect(response.status).toBe(200);
				expect(response.body.data).toHaveLength(1);
			});
		});
	});

	describe("GET /api/meetings/stats", () => {
		it("should require authorization", async () => {
			const response = await request(app).get("/api/meetings/stats");

			expect(response.status).toBe(401);
		});

		it("should return meeting statistics", async () => {
			const fakeDate = new Date();
			await Meeting.create([
				{
					userId,
					title: "Meeting 1",
					date: fakeDate,
					participants: ["User1"],
				},
				{
					userId,
					title: "Meeting 3",
					date: fakeDate,
					participants: ["User1", "User2"],
				},
				{
					userId,
					title: "Meeting 2",
					date: fakeDate,
					participants: ["User1", "User2", "User3"],
				},
			]);

			const response = await request(app)
				.get("/api/meetings/stats")
				.auth(jwtToken, { type: "bearer" });

			expect(response.status).toBe(200);
			expect(response.body.generalStats).toEqual({
				averageDuration: 0,
				averageParticipants: 2,
				longestMeeting: 0,
				shortestMeeting: 0,
				totalMeetings: 3,
				totalParticipants: 6,
			});
			expect(response.body.meetingsByDayOfWeek).toContainEqual({
				count: 3,
				dayOfWeek: fakeDate.getDay() + 1,
			});
			expect(response.body.topParticipants).toEqual([
				{ meetingCount: 3, participant: "User1" },
				{ meetingCount: 2, participant: "User2" },
				{ meetingCount: 1, participant: "User3" },
			]);
		});
	});

	describe("GET /api/meetings/:id", () => {
		it("should require authorization", async () => {
			const meetingTestId = new mongoose.Types.ObjectId();
			const response = await request(app).get(`/api/meetings/${meetingTestId}`);

			expect(response.status).toBe(401);
		});

		it("should retrieve a specific meeting by ID", async () => {
			const meeting = await Meeting.create({
				userId,
				title: "Meeting 1",
				date: new Date(),
				participants: ["User1"],
			});

			const response = await request(app)
				.get(`/api/meetings/${meeting._id}`)
				.auth(jwtToken, { type: "bearer" });

			expect(response.status).toBe(200);
			expect(response.body).toMatchObject({
				title: "Meeting 1",
				participants: ["User1"],
			});
		});

		it("should return no meeting if ID does not exist", async () => {
			const meetingTestId = new mongoose.Types.ObjectId();
			const response = await request(app)
				.get(`/api/meetings/${meetingTestId}`)
				.auth(jwtToken, { type: "bearer" });

			expect(response.status).toBe(404);
		});
	});

	describe("POST /api/meetings", () => {
		it("should require authorization", async () => {
			const response = await request(app).post("/api/meetings");

			expect(response.status).toBe(401);
		});

		it("should create a new meeting for user", async () => {
			const meetingData = {
				userId,
				title: "New Meeting",
				date: new Date().toISOString(),
				participants: ["User1", "User2"],
			};

			const response = await request(app)
				.post("/api/meetings")
				.auth(jwtToken, { type: "bearer" })
				.send(meetingData);

			expect(response.status).toBe(201);
			const createdMeetingId = await Meeting.findOne(meetingData);
			expect(response.body).toMatchObject({
				meetingId: createdMeetingId?.id,
			});
		});
	});

	describe("POST /api/meetings/:id/summarize", () => {
		it("should require authorization", async () => {
			const meetingTestId = new mongoose.Types.ObjectId();
			const response = await request(app).get(
				`/api/meetings/${meetingTestId}/summarize`,
			);

			expect(response.status).toBe(401);
		});

		it("should not update if meeting does not exist", async () => {
			const fakeMeetingId = new mongoose.Types.ObjectId();
			jest.spyOn(logger, "info");

			const response = await request(app)
				.put(`/api/meetings/${fakeMeetingId}/summarize`)
				.auth(jwtToken, { type: "bearer" });

			expect(response.status).toBe(404);
		});

		it("should generate a summary and action items for a meeting", async () => {
			const fakeTranscript = "Transcript Test";
			const fakeSummary = "Summary Test";
			const fakeTasks = [
				{
					title: "Task 1",
					status: "pending",
					description: "Mocked description of Task",
					dueDate: "2024-11-07",
				},
				{
					title: "Task 2",
					status: "in-progress",
					description: "Mocked description of Task",
					dueDate: "2024-11-07",
				},
				{
					title: "Task 3",
					status: "completed",
					description: "Mocked description of Task",
					dueDate: "2024-11-07",
				},
			];
			const meeting = await Meeting.create({
				userId,
				title: "Summarize Meeting",
				date: new Date(),
				participants: ["User1"],
				transcript: fakeTranscript,
			});

			jest
				.spyOn(AIBotService.prototype, "getSummaryAndActions")
				.mockResolvedValueOnce({
					summary: fakeSummary,
					tasks: fakeTasks,
				});

			const response = await request(app)
				.post(`/api/meetings/${meeting._id}/summarize`)
				.auth(jwtToken, { type: "bearer" });

			expect(response.status).toBe(201);
			expect(AIBotService.prototype.getSummaryAndActions).toHaveBeenCalledWith(
				fakeTranscript,
			);
			expect(response.body).toHaveProperty("summary", fakeSummary);
			for (let i = 0; i < fakeTasks.length; i++) {
				expect(response.body.tasks[i]?.title).toEqual(fakeTasks[i].title);
			}
		});
	});

	describe("PUT /api/meetings/:id/transcript", () => {
		it("should require authorization", async () => {
			const meetingTestId = new mongoose.Types.ObjectId();
			const response = await request(app).get(
				`/api/meetings/${meetingTestId}/transcript`,
			);

			expect(response.status).toBe(401);
		});

		it("should not update if meeting does not exist", async () => {
			const fakeMeetingId = new mongoose.Types.ObjectId();
			const transcriptData = { transcript: "Meeting Transcript" };
			const response = await request(app)
				.put(`/api/meetings/${fakeMeetingId}/transcript`)
				.auth(jwtToken, { type: "bearer" })
				.send(transcriptData);

			expect(response.status).toBe(404);
		});

		it("should update a meeting with a new transcript", async () => {
			const meeting = await Meeting.create({
				userId,
				title: "Meeting with Transcript",
				date: new Date(),
				participants: ["User1"],
			});

			const transcriptData = { transcript: "Meeting Transcript" };
			const response = await request(app)
				.put(`/api/meetings/${meeting._id}/transcript`)
				.auth(jwtToken, { type: "bearer" })
				.send(transcriptData);

			expect(response.status).toBe(204);
			const updatedMeeting = await Meeting.findById(meeting.id);
			expect(updatedMeeting?.transcript).toEqual(transcriptData.transcript);
		});
	});
});
