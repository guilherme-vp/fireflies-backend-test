export interface UpcomingMeeting {
	_id: string;
	title: string;
	date: Date;
	participantCount: number;
}

export interface OverdueTask {
	_id: string;
	title: string;
	dueDate: Date;
	meetingId: string;
	meetingTitle: string;
}

export interface DashboardData {
	totalMeetings: number;
	taskSummary: {
		pending: number;
		inProgress: number;
		completed: number;
	};
	upcomingMeetings: UpcomingMeeting[];
	overdueTasks: OverdueTask[];
}
