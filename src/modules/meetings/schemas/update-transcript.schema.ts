import { z } from "zod";

export const updateTranscriptSchema = z.object({
	transcript: z
		.string({ message: "Transcription needs to be a text" })
		.min(1, "Transcription needs to be provided"),
});

export type UpdateTranscriptParams = z.infer<typeof updateTranscriptSchema>;
