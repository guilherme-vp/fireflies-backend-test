import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { settings } from "../config";
import {
	summaryAndActionsResponseSchema,
	type SummaryAndActionsResponseParams,
} from "../modules/meetings";
import { logger } from "../utils/logger.util";

export class AIBotService {
	private client: OpenAI | null = null;

	constructor() {
		const { apiKey } = settings.openAI;
		if (!apiKey) {
			logger.warn(
				"OpenAI credentials not provided, skipping service initialization",
			);
			return;
		}
		this.client = new OpenAI({ apiKey });
		logger.info("OpenAI Client initialized");
	}

	async getSummaryAndActions(
		meetingTranscript: string,
	): Promise<SummaryAndActionsResponseParams> {
		if (!this.client) {
			logger.warn("OpenAI credentials not provided, mocking response...");
			return { tasks: [], summary: "" };
		}
		try {
			const completion = await this.client.beta.chat.completions.parse({
				model: "gpt-4o-mini-2024-07-18",
				messages: [
					{
						role: "system",
						content:
							"You extract a summary and action items from a meeting transcription into JSON data.",
					},
					{
						role: "system",
						content:
							"The summary must be an easily readable text with the key points discussed in the meeting with 2-3 sentences.",
					},
					{
						role: "system",
						content:
							"The action items tasks must have a title, description, status and a due date for that task.",
					},
					{
						role: "system",
						content:
							"Consider the following statuses for the Task: 'pending', 'in-progress', 'completed', define the current status based on the meeting discussion, if none given, set it as 'pending'.",
					},
					{
						role: "user",
						content: meetingTranscript,
					},
				],
				response_format: zodResponseFormat(
					summaryAndActionsResponseSchema,
					"summaryAndActionsResponse",
				),
			});

			logger.info(
				"Finished creating meeting summary and actions itens with OpenAI model",
			);
			const parsedMeetingSummaryAndActionItems =
				completion.choices[0]?.message.parsed;
			if (!parsedMeetingSummaryAndActionItems) {
				logger.warn("No response returned from OpenAI, defaulting...");
				return { tasks: [], summary: "" };
			}

			return parsedMeetingSummaryAndActionItems;
		} catch (error) {
			if (
				error instanceof OpenAI.APIError &&
				error.name === "LengthFinishReasonError"
			) {
				logger.error("Too many tokens: ", error.message);
			}
			throw error;
		}
	}
}
