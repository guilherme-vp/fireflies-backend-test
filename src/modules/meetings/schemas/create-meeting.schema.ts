import { z } from "zod";

export const createMeetingSchema = z.object({
	title: z
		.string({ message: "Title needs to be provided" })
		.min(1, "Title is required"),
	// Validates if the date is an ISO string
	date: z
		.string({ message: "Date needs to be provided" })
		.refine((value) => !Number.isNaN(Date.parse(value)), {
			message: "Date must be a valid ISO string",
		})
		.transform((value) => new Date(value)),
	participants: z
		.array(z.string().min(1, "Participant name cannot be empty"), {
			message: "Participants needs to be provided",
		})
		.min(1, "The meeting must have at least one participant name"),
});

export type CreateMeetingParams = z.infer<typeof createMeetingSchema>;
