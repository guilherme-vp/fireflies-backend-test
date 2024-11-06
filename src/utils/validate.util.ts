import { ZodError, type z } from "zod";
import { InvalidArgumentsError } from "../errors";

// biome-ignore lint/suspicious/noExplicitAny: this is intentionally generic
export const validateData = (input: unknown, schema: z.ZodObject<any, any>) => {
	try {
		schema.parse(input);
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
