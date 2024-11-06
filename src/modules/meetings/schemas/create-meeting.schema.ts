import { z } from "zod";

export const createMeetingSchema = z.object({
	title: z.string().min(1, "Title is required"),
	// Validates if the date is an ISO string
	date: z
		.string()
		.refine((value) => !Number.isNaN(Date.parse(value)), {
			message: "Date must be a valid ISO string",
		})
		.transform((value) => new Date(value)),
	participants: z.array(z.string().min(1, "Participant name cannot be empty")),
});

export type CreateMeetingParams = z.infer<typeof createMeetingSchema>;
