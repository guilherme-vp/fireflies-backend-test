import { z } from "zod";
import { taskSchema } from "../../tasks";

export const summaryAndActionsResponseSchema = z.object({
	tasks: z.array(taskSchema),
	summary: z.string(),
});

export type SummaryAndActionsResponseParams = z.infer<
	typeof summaryAndActionsResponseSchema
>;
