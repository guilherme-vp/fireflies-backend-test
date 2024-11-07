export class AIBotService {
	client: null;

	constructor() {
		this.client = null;
	}

	async getSummaryAndActions(_meetingTranscript: string) {
		return {
			summary: "This is a mock summary of the meeting.",
			tasks: [
				{
					title: "Mock Task 1",
					description: "This is a mock task description.",
					status: "pending",
					dueDate: new Date().toISOString(),
				},
				{
					title: "Mock Task 2",
					description: "Another mock task description.",
					status: "in-progress",
					dueDate: new Date().toISOString(),
				},
			],
		};
	}
}
