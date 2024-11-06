import mongoose from "mongoose";
import { z } from "zod";

export const objectIdParamSchema = z.object({
	id: z.string().refine((val) => {
		return mongoose.Types.ObjectId.isValid(val);
	}),
});

export type ObjectIdParam = z.infer<typeof objectIdParamSchema>;
