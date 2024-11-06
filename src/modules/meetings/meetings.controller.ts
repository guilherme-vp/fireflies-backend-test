import type { Request, Response } from "express";
import type { MeetingsService } from "./meetings.service";
import assert from "node:assert";
import { HTTPStatusEnum } from "../../constants";
import type { TasksService } from "../tasks/tasks.service";

export class MeetingsController {
	constructor(
		private readonly meetingService: MeetingsService,
		private readonly taskService: TasksService,
	) {}

	async getMeetingById(req: Request, res: Response) {
		assert(req.userId); // At this point req.userId should exist

		const foundMeeting = await this.meetingService.getMeetingById({
			meetingId: req.params.id,
			userId: req.userId,
		});
		const meetingTasks = await this.taskService.getMeetingTasks(req.params.id);

		res
			.status(HTTPStatusEnum.OK)
			.json({ ...foundMeeting, tasks: meetingTasks });
	}

	async getUserMeetings(req: Request, res: Response) {
		assert(req.userId); // At this point req.userId should exist

		const { page = "1", limit } = req.query;
		const meetings = await this.meetingService.getUserMeetings(req.userId, {
			page: Number(page),
			limit: limit ? Number(limit) : undefined,
		});
		res.status(HTTPStatusEnum.OK).json(meetings);
	}

	async getMeetingsStats(_req: Request, res: Response) {
		const stats = await this.meetingService.getMeetingsStats();
		res.status(HTTPStatusEnum.OK).json(stats);
	}

	async createMeeting(req: Request, res: Response) {
		assert(req.userId); // At this point req.userId should exist

		const createdMeetingId = await this.meetingService.createMeeting({
			userId: req.userId,
			meeting: req.body,
		});

		res.status(HTTPStatusEnum.CREATED).json({ meetingId: createdMeetingId });
	}

	async updateMeetingTranscription(req: Request, res: Response) {
		assert(req.userId); // At this point req.userId should exist

		await this.meetingService.updateMeetingTranscript({
			userId: req.userId,
			meetingId: req.params.id,
			transcript: req.body.transcript,
		});
		res.status(HTTPStatusEnum.NO_CONTENT);
	}
}

export default MeetingsController;
