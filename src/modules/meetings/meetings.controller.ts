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
}

export default MeetingsController;
