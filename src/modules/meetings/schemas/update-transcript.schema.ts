import { z } from "zod";

export const updateTranscriptSchema = z.object({
	transcript: z
		.string({ message: "The Transcription needs to be a text" })
		.min(1, "A transcription needs to be provided"),
});

export type UpdateTranscriptParams = z.infer<typeof updateTranscriptSchema>;
