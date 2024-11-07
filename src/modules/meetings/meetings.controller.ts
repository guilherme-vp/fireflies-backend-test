import type { Request, Response } from "express";
import type { MeetingsService } from "./meetings.service";
import { HTTPStatusEnum } from "../../constants";
import type { TasksService } from "../tasks/tasks.service";
import { ObjectNotFoundError } from "../../errors";
import type { AIBotService } from "../../services/ai-bot.service";

export class MeetingsController {
	constructor(
		private readonly meetingService: MeetingsService,
		private readonly taskService: TasksService,
		private readonly aiBotService: AIBotService,
	) {}

	async getMeetingById(req: Request, res: Response) {
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
		const createdMeetingId = await this.meetingService.createMeeting({
			userId: req.userId,
			meeting: req.body,
		});

		res.status(HTTPStatusEnum.CREATED).json({ meetingId: createdMeetingId });
	}

	async updateMeetingTranscription(req: Request, res: Response) {
		await this.meetingService.updateMeetingTranscript({
			userId: req.userId,
			meetingId: req.params.id,
			transcript: req.body.transcript,
		});
		res.status(HTTPStatusEnum.NO_CONTENT).json();
	}

	async summarizeMeeting(req: Request, res: Response) {
		const meetingId = req.params.id;
		const userId = req.userId;
		const foundMeeting = await this.meetingService.getMeetingById({
			meetingId,
			userId,
		});
		if (foundMeeting.transcript == null) {
			throw new ObjectNotFoundError({
				entity: "Meeting Transcript",
				identifiers: { meetingId, userId },
			});
		}

		const meetingSummary = await this.aiBotService.getSummaryAndActions(
			foundMeeting.transcript,
		);
		await this.meetingService.updateMeetingSummary({
			userId,
			meetingId,
			summary: meetingSummary.summary,
		});
		await this.taskService.createMeetingTasks({
			userId,
			meetingId,
			tasks: meetingSummary.tasks,
		});

		res.status(HTTPStatusEnum.CREATED).json(meetingSummary);
	}
}

export default MeetingsController;
