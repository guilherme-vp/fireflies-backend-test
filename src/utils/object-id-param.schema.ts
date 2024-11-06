import mongoose from "mongoose";
import { z } from "zod";

export const objectIdParamSchema = z.object({
	id: z.string().refine(
		(val) => {
			return mongoose.Types.ObjectId.isValid(val);
		},
		{ message: "Provided id is not a valid Object ID" },
	),
});

export type ObjectIdParam = z.infer<typeof objectIdParamSchema>;
