import { ObjectNotFoundError } from "../../errors";
import { type PaginationParams, logger } from "../../utils";
import type { MeetingRepository } from "./meetings.repository";
import type { DatabaseStats, IMeeting } from "./models";

export class MeetingsService {
	constructor(private readonly meetingRepository: MeetingRepository) {}

	public async getUserMeetings(
		userId: string,
		pagination: PaginationParams,
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

	public async getMeetingsStats(): Promise<DatabaseStats> {
		const aggregatedStats = await this.meetingRepository.getStats();
		logger.info("Found meetings stats", {
			aggregatedStats,
		});
		return aggregatedStats;
	}

	public async updateMeetingTranscript(args: {
		userId: string;
		meetingId: string;
		transcript: string;
	}): Promise<boolean> {
		const { meetingId, userId } = args;
		const hasUpdated = await this.meetingRepository.updateTranscript(args);

		if (!hasUpdated) {
			logger.info("Could not update Meeting", { meetingId, userId });
			throw new ObjectNotFoundError({
				entity: "Meeting",
				identifiers: { meetingId, userId },
			});
		}

		logger.info("Successfully updated meeting's transcription", {
			meetingId,
			userId,
		});
		return true;
	}
}
