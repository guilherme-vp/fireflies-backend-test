import type { Request, Response, NextFunction } from "express";
import { type z, ZodError } from "zod";
import { HTTPStatusEnum } from "../constants";
import { InvalidArgumentsError } from "../errors/invalid-arguments.error";

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
				throw new InvalidArgumentsError({ details: errorMessages });
			}
			throw error;
		}
	};
}
