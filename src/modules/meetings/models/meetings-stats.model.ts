export interface GeneralStats {
	totalMeetings: number;
	averageParticipants: number;
	totalParticipants: number;
	shortestMeeting: number;
	longestMeeting: number;
	averageDuration: number;
}

export interface TopParticipantsStats {
	participant: string;
	meetingCount: number;
}

export interface MeetingsByDayOfWeekStats {
	dayOfWeek: number;
	count: number;
}

export interface DatabaseStats {
	generalStats: GeneralStats;
	topParticipants: TopParticipantsStats;
	meetingsByDayOfWeek: MeetingsByDayOfWeekStats;
}
