import type { Request, Response, NextFunction } from "express";
import { validateData } from "../utils";

type AvailableInputTypes = "body" | "params" | "query";

// Example of use: app.use('/', validateData('body', validationSchema), controller)
export function validateExpress(
	type: AvailableInputTypes,
	// biome-ignore lint/suspicious/noExplicitAny: this is intentionally generic so we can use any kind of validator in the future
	schema: any,
) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const inputTypes: Record<AvailableInputTypes, unknown> = {
			body: req.body,
			params: req.params,
			query: req.query,
		};
		const input = inputTypes[type];
		validateData(input, schema);
		next();
	};
}
