import type { Request, Response, NextFunction } from "express";
import { type z, ZodError } from "zod";
import { HTTPStatusEnum } from "../constants";

// Example of use: app.use('/', validateData(validationSchema), controller)
// biome-ignore lint/suspicious/noExplicitAny: this is intentionally generic
export function validateData(schema: z.ZodObject<any, any>) {
	return (req: Request, res: Response, next: NextFunction) => {
		try {
			schema.parse(req.body);
			next();
		} catch (error) {
			if (error instanceof ZodError) {
				const errorMessages = error.errors.map((issue) => ({
					message: `${issue.path.join(".")} is ${issue.message}`,
				}));
				res
					.status(HTTPStatusEnum.BAD_REQUEST)
					.json({ error: "Invalid data", details: errorMessages });
			} else {
				res
					.status(HTTPStatusEnum.INTERNAL_SERVER_ERROR)
					.json({ error: "Internal Server Error" });
			}
		}
	};
}
