import { Meeting, type IMeeting, type DatabaseStats } from "./models";

export class MeetingRepository {
	async create(
		userId: string,
		meeting: Pick<IMeeting, "title" | "date" | "participants">,
	): Promise<IMeeting> {
		return (await Meeting.create({ ...meeting, userId })).toJSON();
	}

	async update(
		args: {
			userId: string;
			meetingId: string;
		} & Partial<IMeeting>,
	): Promise<boolean> {
		const { meetingId, userId, ...updateArgs } = args;

		const result = await Meeting.updateOne(
			{ _id: meetingId, userId },
			updateArgs,
		)
			.lean()
			.exec();
		return result.modifiedCount === 1;
	}

	async getById(meetingId: string, userId: string): Promise<IMeeting | null> {
		return await Meeting.findOne({ _id: meetingId, userId }).lean().exec();
	}

	async getByUserId(
		userId: string,
		pagination: { page: number; limit?: number },
	): Promise<IMeeting[]> {
		const meetingsQuery = Meeting.find({
			userId,
		});
		if (pagination.limit) {
			meetingsQuery
				.limit(pagination.limit)
				.skip((pagination.page - 1) * pagination.limit);
		}
		return meetingsQuery.lean().exec();
	}

	async countByUserId(userId: string): Promise<number> {
		return await Meeting.countDocuments({
			userId,
		});
	}

	async getStats(): Promise<DatabaseStats> {
		const stats = await Meeting.aggregate([
			{
				$facet: {
					generalStats: [
						{
							$group: {
								_id: 0,
								totalMeetings: { $sum: 1 },
								totalParticipants: { $sum: { $size: "$participants" } },
								averageParticipants: { $avg: { $size: "$participants" } },
								// We don't persist the duration of a meeting, so here we're arbitrary considering that every word
								// transcribe is equivalent to 1 second.
								// TODO: (@guilherme-vp) Persist durations in Meeting's model
								shortestMeeting: { $min: { $strLenCP: "$transcript" } },
								longestMeeting: { $max: { $strLenCP: "$transcript" } },
								averageDuration: { $avg: { $strLenCP: "$transcript" } },
							},
						},
						{
							$project: {
								_id: 0,
								totalMeetings: "$totalMeetings",
								averageParticipants: "$averageParticipants",
								totalParticipants: "$totalParticipants",
								shortestMeeting: "$shortestMeeting",
								longestMeeting: "$longestMeeting",
								averageDuration: { $round: ["$averageDuration", 1] },
							},
						},
					],
					topParticipants: [
						{
							$unwind: "$participants",
						},
						{
							$group: {
								_id: "$participants",
								meetingCount: { $sum: 1 },
							},
						},
						{
							$sort: {
								meetingCount: -1,
							},
						},
						{
							$limit: 5,
						},
						{
							$project: {
								_id: 0,
								participant: "$_id",
								meetingCount: "$meetingCount",
							},
						},
					],
					meetingsByDayOfWeek: [
						{
							$addFields: {
								dayOfWeek: { $dayOfWeek: "$date" },
							},
						},
						{
							$group: {
								_id: "$dayOfWeek",
								meetingCount: { $sum: 1 },
							},
						},
						{
							$sort: {
								_id: 1,
							},
						},
						{
							$project: {
								_id: 0,
								dayOfWeek: "$_id",
								count: "$meetingCount",
							},
						},
					],
				},
			},
		]);
		// Mongoose does not understand that we're returning only one object for all aggregations
		return stats as unknown as DatabaseStats;
	}

	async getUpcomingMeetings(
		userId: string,
		limit = 5,
	): Promise<
		Array<
			Pick<IMeeting, "_id" | "title" | ("date" & { participantCount: number })>
		>
	> {
		return await Meeting.find(
			{ userId, date: { $gte: new Date() } },
			{
				_id: 1,
				title: 1,
				date: 1,
				participantCount: { $size: "$participants" }, // Count participants
			},
			{ limit, sort: { date: 1 } },
		)
			.lean()
			.exec();
	}
}
