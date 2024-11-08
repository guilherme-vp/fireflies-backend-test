import { ObjectNotFoundError } from "../../errors";
import type { PaginationParams } from "../../utils/pagination.schema";
import { logger } from "../../utils/logger.util";
import type { MeetingRepository } from "./meetings.repository";
import type { DatabaseStats, IMeeting } from "./models";
import type { CreateMeetingParams } from "./schemas";

export class MeetingsService {
	constructor(private readonly meetingRepository: MeetingRepository) {}

	public async getMeetingById(args: {
		userId: string;
		meetingId: string;
	}): Promise<IMeeting> {
		const { meetingId, userId } = args;
		const foundMeeting = await this.meetingRepository.getById(
			meetingId,
			userId,
		);

		if (foundMeeting == null) {
			throw new ObjectNotFoundError({
				entity: "Meeting",
				identifiers: { userId, meetingId },
			});
		}
		logger.info("Found meeting for user", meetingId);
		return foundMeeting;
	}

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
		logger.info("Found meetings stats");
		return aggregatedStats;
	}

	public async createMeeting(args: {
		userId: string;
		meeting: CreateMeetingParams;
	}): Promise<string> {
		const { userId, meeting } = args;
		const createdMeeting = await this.meetingRepository.create(userId, meeting);
		logger.info("Successfully created meeting", {
			userId,
			meetingId: createdMeeting._id,
		});
		return createdMeeting._id;
	}

	public async updateMeetingTranscript(args: {
		userId: string;
		meetingId: string;
		transcript: string;
	}): Promise<boolean> {
		const { meetingId, userId } = args;
		const hasUpdated = await this.meetingRepository.update(args);

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

	public async updateMeetingSummary(args: {
		userId: string;
		meetingId: string;
		summary: string;
	}): Promise<boolean> {
		const { meetingId, userId } = args;
		await this.meetingRepository.update(args);

		logger.info("Successfully updated meeting's summary", {
			meetingId,
			userId,
		});
		return true;
	}
}
