import type { Request, Response } from "express";
import type { MeetingsService } from "./meetings.service";
import assert from "node:assert";
import { HTTPStatusEnum } from "../../constants";
import type { PaginationParams } from "../../utils";

export class MeetingsController {
	constructor(private readonly meetingService: MeetingsService) {}

	async getUserMeetings(req: Request, res: Response) {
		assert(req.userId); // At this poisnt req.userId should exist

		const { page = 1, limit } = req.query as unknown as PaginationParams;
		const meetings = await this.meetingService.getUserMeetings(req.userId, {
			page,
			limit,
		});
		res.status(HTTPStatusEnum.OK).json(meetings);
	}

	async getMeetingsStats(_req: Request, res: Response) {
		const stats = await this.meetingService.getMeetingsStats();
		res.status(HTTPStatusEnum.OK).json(stats);
	}

	async updateMeetingTranscription(req: Request, res: Response) {
		assert(req.userId); // At this point req.userId should exist

		await this.meetingService.updateMeetingTranscript({
			userId: req.userId,
			meetingId: req.params.id,
			transcript: req.body.transcript,
		});
		res.status(HTTPStatusEnum.NO_CONTENT).json({ ok: true });
	}
}

export default MeetingsController;
