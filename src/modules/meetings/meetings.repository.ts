import { Meeting, type DatabaseStats } from "./models";

export class MeetingRepository {
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
