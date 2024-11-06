import { z } from "zod";

export const paginationSchema = z.object({
	page: z.number().int().min(1).finite().default(1),
	limit: z.number().int().min(1).finite().optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
