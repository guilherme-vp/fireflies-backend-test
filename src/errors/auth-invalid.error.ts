import { ModuleError } from "./module-error.error";
import { ErrorCodeEnum } from "./error-code.enum";
import { HTTPStatusEnum } from "../constants";

export class AuthInvalidError extends ModuleError {
	constructor() {
		super({
			message: "Authentication required.",
			httpCode: HTTPStatusEnum.UNAUTHORIZED,
			internalCode: ErrorCodeEnum.InvalidAuthentication,
		});
	}
}
