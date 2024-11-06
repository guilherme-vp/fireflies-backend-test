import { z } from "zod";

export const paginationSchema = z.object({
	page: z.number().int().min(1).finite().optional(),
	limit: z.number().int().min(1).finite().optional(),
});
