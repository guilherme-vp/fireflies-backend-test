import { ModuleError } from "./module-error.error";
import { ErrorCodeEnum } from "./error-code.enum";
import { HTTPStatusEnum } from "../constants";

interface ObjectNotFoundErrorMetadata {
	entity?: string;
	identifiers: Record<string, unknown>;
}

export class ObjectNotFoundError extends ModuleError<ObjectNotFoundErrorMetadata> {
	constructor(readonly metadata: ObjectNotFoundErrorMetadata) {
		super({
			message: `${metadata.entity ?? "Object"} not found`,
			httpCode: HTTPStatusEnum.NOT_FOUND,
			internalCode: ErrorCodeEnum.NotFound,
			metadata,
		});
	}
}
