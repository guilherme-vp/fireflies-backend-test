import { Meeting, type IMeeting, type DatabaseStats } from "./models";

export class MeetingRepository {
	async create(
		meeting: Pick<IMeeting, "title" | "date" | "participants">,
	): Promise<IMeeting> {
		return (await Meeting.create(meeting)).toJSON();
	}

	async updateTranscript(_id: string, transcript: string): Promise<boolean> {
		const result = await Meeting.updateOne({ _id }, { transcript })
			.lean()
			.exec();
		return result.modifiedCount === 1;
	}

	async getById(meetingId: string): Promise<IMeeting | null> {
		return await Meeting.findById(meetingId).populate("tasks").lean().exec();
	}

	async getByUserId(
		userId: string,
		pagination: { page: number; limit?: number },
	): Promise<IMeeting[]> {
		const meetings = await Meeting.find({
			userId,
			limit: pagination?.limit,
			skip:
				pagination.limit != null
					? (pagination.page - 1) * pagination.limit
					: undefined,
		})
			.lean()
			.exec();
		return meetings;
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
}
