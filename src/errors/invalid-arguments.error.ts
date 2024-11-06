import { ModuleError } from "./module-error.error";
import { ErrorCodeEnum } from "./error-code.enum";
import { HTTPStatusEnum } from "../constants";

interface InvalidArgumentsErrorMetadata {
	details?: Array<{
		message: string;
	}>;
}

export class InvalidArgumentsError extends ModuleError<InvalidArgumentsErrorMetadata> {
	constructor(readonly metadata: InvalidArgumentsErrorMetadata) {
		super({
			message: "Invalid Arguments were given.",
			httpCode: HTTPStatusEnum.BAD_REQUEST,
			internalCode: ErrorCodeEnum.InvalidArgument,
			metadata,
		});
	}
}
