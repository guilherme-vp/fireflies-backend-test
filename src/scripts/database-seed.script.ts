import mongoose from "mongoose";
import { randomInt } from "node:crypto";
import {
	Meeting,
	type IMeeting,
} from "../modules/meetings/models/meeting.model";
import { Task, type ITask } from "../modules/tasks/models/task.model";
import { logger } from "../utils/logger.util";

const MONGODB_URI = "mongodb://localhost:27017/meetingbot";

await mongoose
	.connect(MONGODB_URI)
	.then(() => logger.info("Connected to MongoDB for seeding"))
	.catch((err) => logger.error("MongoDB connection error:", err));

const users = ["user1", "user2", "user3", "user4", "user5"];
const participants = [
	"Alice",
	"Bob",
	"Charlie",
	"David",
	"Eva",
	"Frank",
	"Grace",
	"Henry",
	"Ivy",
	"Jack",
];

function randomDate(start: Date, end: Date): Date {
	return new Date(
		start.getTime() + randomInt(0, end.getTime() - start.getTime()),
	);
}

function randomParticipants(): string[] {
	const count = randomInt(2, 7); // 2 to 6 participants
	return participants.sort(() => 0.5 - Math.random()).slice(0, count);
}

async function seedMeetings() {
	await Meeting.deleteMany({});

	const meetings: IMeeting[] = [];

	for (let i = 0; i < 100; i++) {
		const userId = users[randomInt(0, users.length)];
		const meeting = new Meeting({
			userId: userId,
			title: `Meeting ${i + 1}`,
			date: randomDate(new Date(2024, 0, 1), new Date(2030, 0, 1)),
			participants: randomParticipants(),
			transcript: `This is a sample transcript for meeting ${i + 1}.`,
			summary: `Summary of meeting ${i + 1}`,
			actionItems: [
				`Action item 1 for meeting ${i + 1}`,
				`Action item 2 for meeting ${i + 1}`,
			],
		});
		meetings.push(meeting);
	}

	await Meeting.insertMany(meetings);
	logger.info("Meetings seeded successfully");
}

async function seedTasks() {
	await Task.deleteMany({});

	const meetings = await Meeting.find();
	const tasks: ITask[] = [];

	for (const meeting of meetings) {
		const taskCount = randomInt(1, 4); // 1 to 3 tasks per meeting
		for (let i = 0; i < taskCount; i++) {
			const task = new Task({
				meetingId: meeting._id,
				userId: meeting.userId,
				title: `Task ${i + 1} from ${meeting.title}`,
				description: `This is a sample task from meeting ${meeting.title}`,
				status: ["pending", "in-progress", "completed"][
					Math.floor(Math.random() * 3)
				],
				dueDate: new Date(
					meeting.date.getTime() + randomInt(0, 7 * 24 * 60 * 60 * 1000),
				), // Random date within a week of the meeting
			});
			tasks.push(task);
		}
	}

	await Task.insertMany(tasks);
	logger.info("Tasks seeded successfully");
}

await seedMeetings();
await seedTasks();
await mongoose.connection.close();
