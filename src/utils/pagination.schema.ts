import { z } from "zod";

export const paginationSchema = z.object({
	page: z
		.string()
		.optional()
		.transform((value) => (value ? Number.parseInt(value, 10) : 1))
		.refine(
			(value) => value === undefined || (Number.isInteger(value) && value > 0),
			{
				message: "Page must be a positive number",
			},
		),
	limit: z
		.string()
		.optional()
		.transform((value) => (value ? Number.parseInt(value, 10) : undefined))
		.refine(
			(value) => value === undefined || (Number.isInteger(value) && value > 0),
			{
				message: "Limit must be a positive number",
			},
		),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
