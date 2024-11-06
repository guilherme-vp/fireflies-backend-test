import { logger } from "../../utils";
import type { MeetingRepository } from "./meetings.repository";
import type { IMeeting } from "./models";

export class MeetingsService {
	constructor(private readonly meetingRepository: MeetingRepository) {}

	public async getUserMeetings(
		userId: string,
		pagination: { page: number; limit?: number },
	): Promise<{
		total: number;
		limit?: number;
		page: number;
		data: IMeeting[];
	}> {
		const { page, limit } = pagination;
		const meetingsCount = await this.meetingRepository.countByUserId(userId);
		const meetings = await this.meetingRepository.getByUserId(userId, {
			page,
			limit,
		});
		logger.info("Found meetings for user", {
			meetingsIds: meetings.map(({ _id }) => _id),
			meetingsCount,
		});

		return {
			data: meetings,
			total: meetingsCount,
			limit,
			page,
		};
	}
}
