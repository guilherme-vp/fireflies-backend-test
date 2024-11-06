import type { HTTPStatusEnum } from "../constants";
import type { ErrorCodeEnum } from "./error-code.enum";

type ErrorMetadata = unknown | undefined;

export interface ModuleErrorParams<T> {
	message: string;
	internalCode: ErrorCodeEnum;
	httpCode: HTTPStatusEnum;
	metadata?: T;
}

export class ModuleError<T extends ErrorMetadata = undefined> extends Error {
	public metadata?: ErrorMetadata;
	public internalCode: ErrorCodeEnum;
	public httpCode: HTTPStatusEnum;

	constructor(params: ModuleErrorParams<T>) {
		const { message, httpCode, internalCode, metadata } = params;

		super(message);
		this.internalCode = internalCode;
		this.httpCode = httpCode;
		this.metadata = metadata;

		Error.captureStackTrace(this, this.constructor);
	}
}
